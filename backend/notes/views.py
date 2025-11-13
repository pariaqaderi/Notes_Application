from rest_framework import viewsets
from notes.models import Note
from notes.serializers import NoteSerializer


# Create your views here.
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-updated')
    serializer_class = NoteSerializer



