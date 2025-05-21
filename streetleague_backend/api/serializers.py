from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import League, Chat, Message, UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LeagueSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True, source='host')  # Rename for clarity if needed
    participants = UserSerializer(many=True, read_only=True)
    is_joined = serializers.SerializerMethodField()

    class Meta:
        model = League
        fields = '__all__'
        read_only_fields = ('created_by', 'is_joined')

    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.participants.filter(id=request.user.id).exists()
        return False


class MessageSerializer(serializers.ModelSerializer):
    # Serialize message sender (user)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'content', 'user', 'created_at')

class ChatSerializer(serializers.ModelSerializer):
    # Include league data in the chat serializer
    league = LeagueSerializer(read_only=True)
    # Include messages related to the chat
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'league', 'messages', 'created_at')


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True)
    username = serializers.CharField(source='user.username', read_only=True)
    age = serializers.SerializerMethodField()
    leagues_joined = serializers.SerializerMethodField()
    leagues_created = serializers.SerializerMethodField()
    favorite_sports = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    favorite_sports_display = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'full_name', 'username', 'avatar', 'age', 'bio', 'favorite_sports', 'favorite_sports_display',
            'gender', 'leagues_joined', 'leagues_created', 'birth_date'
        ]
        read_only_fields = ['user', 'age', 'leagues_joined', 'leagues_created', 'favorite_sports_display']

    def get_age(self, obj):
        return obj.calculate_age()

    def get_leagues_joined(self, obj):
        return obj.user.joined_leagues.exclude(created_by=obj.user).count()

    def get_leagues_created(self, obj):
        return obj.user.created_leagues.count()

    def get_favorite_sports_display(self, obj):
        return obj.favorite_sports.split(',') if obj.favorite_sports else []

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Optional: rename 'favorite_sports_display' to 'favorite_sports' in output
        representation['favorite_sports'] = representation.pop('favorite_sports_display')
        return representation

    def update(self, instance, validated_data):
        # Convert favorite_sports list to comma-separated string
        favorite_sports = validated_data.pop('favorite_sports', None)
        if favorite_sports is not None:
            validated_data['favorite_sports'] = ','.join(favorite_sports)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        favorite_sports = validated_data.pop('favorite_sports', None)
        if favorite_sports is not None:
            validated_data['favorite_sports'] = ','.join(favorite_sports)
        return super().create(validated_data)
