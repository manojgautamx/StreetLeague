from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone  # ✅ Added for default datetime

class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="api_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="api_user_permissions", blank=True)

class League(models.Model):
    LEAGUE_TYPE_CHOICES = [
        ('casual', 'Casual'),
        ('competitive', 'Competitive'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    sport = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_time = models.DateTimeField(default=timezone.now)  # ✅ Added default
    league_type = models.CharField(max_length=20, choices=LEAGUE_TYPE_CHOICES)

    # 🔥 Optional fields for richer UX
    max_players = models.PositiveIntegerField(default=0)
    price = models.CharField(max_length=50, default="Free")

    created_at = models.DateTimeField(default=timezone.now)  # ✅ Added with default

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_leagues',
        null=True,
        blank=True
    )

    participants = models.ManyToManyField(User, related_name='joined_leagues', blank=True)

    def __str__(self):
        return self.name
    
    def is_full(self):
        return self.max_players > 0 and self.participants.count() >= self.max_players

class Chat(models.Model):
    league = models.OneToOneField(League, on_delete=models.CASCADE, related_name="chat")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat for {self.league.name}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user.username} at {self.created_at}"
