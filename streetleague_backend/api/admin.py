from django.contrib import admin
from .models import League

# Customize admin display
class LeagueAdmin(admin.ModelAdmin):
    list_display = ('league_name', 'sport', 'location', 'date', 'time', 'category')
    search_fields = ('league_name', 'sport', 'location')

admin.site.register(League, LeagueAdmin)
