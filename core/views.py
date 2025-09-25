from django.shortcuts import render

# Create your views here.


def index(request):
    """Renders the index.html page for the homepage"""
    return render(request, 'core/index.html')
