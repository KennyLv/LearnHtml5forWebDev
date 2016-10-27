from django.db import models

# Create your models here.
class color(models.Model):
    name = models.CharField(max_length=30)
    pub_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name