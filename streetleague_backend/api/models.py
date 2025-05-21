from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone
from django.contrib import admin


# ✅ Custom User model
class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="api_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="api_user_permissions", blank=True)


# ✅ League model with status field (active/completed)
class League(models.Model):
    LEAGUE_TYPE_CHOICES = [
        ('casual', 'Casual'),
        ('competitive', 'Competitive'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    sport = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_time = models.DateTimeField()
    league_type = models.CharField(max_length=20, choices=LEAGUE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    max_players = models.PositiveIntegerField(default=0)
    price = models.CharField(max_length=50, default="Free")
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_leagues')
    participants = models.ManyToManyField(User, related_name='joined_leagues', blank=True)

    def __str__(self):
        return self.name

    def is_full(self):
        return self.max_players > 0 and self.participants.count() >= self.max_players

    def check_and_complete(self):
        """
        Automatically change the status to 'completed' if the current time
        is past the league's date_time.
        """
        if self.date_time < timezone.now() and self.status != 'completed':
            self.status = 'completed'
            self.save()


# ✅ Chat model associated with each League
class Chat(models.Model):
    league = models.OneToOneField(League, on_delete=models.CASCADE, related_name="chat")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat for {self.league.name}"


# ✅ Message model to store chat messages
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user.username} at {self.created_at}"


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)
    favorite_sports = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    def calculate_age(self):
        from datetime import date
        if not self.birth_date:
            return None
        today = date.today()
        return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))