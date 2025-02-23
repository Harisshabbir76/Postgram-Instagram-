from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import post, UserProfile
from .serializers import Postserializers
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404
import random
import smtplib
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings


class RegisterView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate OTP
        otp = random.randint(100000, 999999)

        # Store OTP in cache (valid for 5 minutes)
        cache.set(f"otp_{email}", otp, timeout=300)  

        # Send OTP Email
        send_mail(
            subject="Your OTP for Registration",
            message=f"Your OTP is {otp}. It is valid for 5 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)




class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp_entered = request.data.get("otp")
        password = request.data.get("password")
        username = request.data.get("username")
        name = request.data.get("name")

        stored_otp = cache.get(f"otp_{email}")

        if not stored_otp or str(stored_otp) != str(otp_entered):
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user and set password
        user = User.objects.create_user(username=username, email=email, password=password)
        user.first_name = name
        user.save()

        # Remove OTP from cache
        cache.delete(f"otp_{email}")

        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)




class Loginviews(APIView):
    permission_classes=[AllowAny]
    
    def post(self,request):
        username=request.data.get("username")
        password=request.data.get("password")


        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({"refresh": str(refresh), "access": str(refresh.access_token)})

        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    

 

class PostList(ListCreateAPIView):
    serializer_class = Postserializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return post.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request} 


class LogoutView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")

            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist() 

            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class CreatePost(ListCreateAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class = Postserializers
    parser_classes=(MultiPartParser, FormParser)

    def get_queryset(self):
        return post.objects.filter(user=self.request.user).order_by('-created_at')
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_serializer_context(self): 
        return {'request': self.request}
    

class feedview(ListCreateAPIView):
    serializer_class=Postserializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return post.objects.exclude(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def get_serializer_context(self):
        return {'request': self.request} 
    

class profile_infoView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user=request.user
        return Response({
            "name":user.first_name,
            "username":user.username,
            "email":user.email,
            

        })


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        
        
        try:
            data = request.data
        except Exception as e:
            return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

        
        user.first_name = data.get("name", user.first_name)
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.save()

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

class Forgotpasswordview(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            return Response({"message": "Email found. You can reset your password."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Incorrect email. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        
        email = request.data.get("email")
        new_password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        

class SearchUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.GET.get('q', '')
        users = User.objects.filter(username__icontains=query)  | User.objects.filter(first_name__icontains=query)
        user_data = [{"id": user.id, "username": user.username, "name": user.first_name} for user in users]
        return Response(user_data, status=200)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    try:
        profile_picture_url = user.profile.profile_picture.url if user.profile.profile_picture else None
    except UserProfile.DoesNotExist:
        profile_picture_url = None
    return Response({
        "name": user.get_full_name() or user.username,
        "username": user.username,
        "profile_picture": profile_picture_url
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = post.objects.filter(user=user).order_by('-created_at')
    serializer = Postserializers(posts, many=True, context={'request': request})  # ✅ Fix: Add request context
    return Response(serializer.data)





