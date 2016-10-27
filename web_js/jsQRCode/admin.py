from django.contrib import admin
from color.models import color


# Register your models here.
class colorAdmin(admin.ModelAdmin):
    list_display = ('name', 'pub_date')



# Register your models here.
admin.site.register(color,colorAdmin)