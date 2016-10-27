from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('color.views',
                       
    url(r'^color/$','color_form',name = 'color_form'),
    url(r'^search_color/$','search_color',name = 'search_color'),
    url(r'^(?P<color_id>\d+)/$','color_detail',name = "detail"),
    url(r'^color/saveColorHint','saveColorHint',name = "colorHint"),

)

