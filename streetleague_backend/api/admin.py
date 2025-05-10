from django.contrib import admin
from .models import League, Chat, Message
from django.contrib.auth import get_user_model

User = get_user_model()
admin.site.register(User)

class LeagueAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'location', 'date_time', 'league_type', 'max_players', 'price', 'created_by')
    list_editable = ('max_players', 'price')
    list_filter = ('league_type', 'sport')
    search_fields = ('name', 'sport', 'location', 'created_by__username')
    exclude = ('created_by',)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = User.objects.get(pk=request.user.pk)
        obj.save()

admin.site.register(League, LeagueAdmin)
admin.site.register(Chat)
admin.site.register(Message)
