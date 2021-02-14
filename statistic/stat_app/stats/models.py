from django.db import models

# Create your models here.
from django.db import models

class AppUser(models.Model):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=200)

class Area(models.Model):
    name=models.CharField(max_length=200)
    location=models.CharField(max_length=200)
    body_of_water_type=models.CharField(max_length=100)
    body_of_water_name=models.CharField(max_length=200)
    licence_issuer=models.CharField(max_length=200,default="")
    description = models.TextField(max_length=500,default="")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    app_user = models.ForeignKey(AppUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Comment(models.Model):
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)




