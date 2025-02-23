from django.urls import path
from .views import RegisterView,Loginviews,PostList,LogoutView,CreatePost,feedview,profile_infoView,EditProfileView,Forgotpasswordview,SearchUserView
from .views import user_profile, user_posts,VerifyOTPView


urlpatterns = [
    path('register/', RegisterView.as_view(),name="register"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path('login/', Loginviews.as_view(),name="login"),
    path('profile/', PostList.as_view(),name="profile"),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('upload/', CreatePost.as_view(), name='upload'),
    path('',feedview.as_view(), name='feed' ),
    path('profile/profile-info/',profile_infoView.as_view(), name='profile info' ),
    path('profile/edit-profile/', EditProfileView.as_view(), name="edit-profile"),
    path('login/forget-password',Forgotpasswordview.as_view(), name='forgot-password' ),
    path('search/', SearchUserView.as_view(), name='search-users'),
    path('profile/<str:username>/', user_profile, name="user-profile"), 
    path('profile/<str:username>/posts/', user_posts, name="user-posts"),
]
