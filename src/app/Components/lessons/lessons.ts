import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonsService } from '../../Services/lessons-service';
import { Ilesson } from '../../Models/ilesson';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-lessons',
  imports: [CommonModule, Loader],
  templateUrl: './lessons.html',
  styleUrl: './lessons.scss',
})
export class Lessons implements OnInit {
  pendingLessons: Ilesson[] = [];
  loading: boolean = true;
  selectedLesson: Ilesson | null = null;

  isModalOpen: boolean = false;
  modalAction: 'approve' | 'reject' | 'video' | null = null;
  videoUrl: SafeResourceUrl | null = null;
  isPlaying: boolean = false;

  constructor(
    private lessonsService: LessonsService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.lessonsService.getPendingLessons().subscribe({
      next: (lessons) => {
        console.log('Pending lessons:', lessons);
        this.pendingLessons = lessons.data;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load pending lessons');
        this.loading = false;
      },
    });
  }

  openModal(lesson: Ilesson, action: 'approve' | 'reject') {
    this.selectedLesson = lesson;
    this.modalAction = action;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedLesson = null;
    this.modalAction = null;
  }

  confirmAction() {
    if (!this.selectedLesson) return;

    if (this.modalAction === 'approve') {
      this.approveLesson(this.selectedLesson._id);
    } else if (this.modalAction === 'reject') {
      this.rejectLesson(this.selectedLesson._id);
    }
  }

  approveLesson(lessonId: string) {
    this.lessonsService.approveLesson(lessonId).subscribe({
      next: (response) => {
        this.toastr.success('Lesson approved successfully');
        this.pendingLessons = this.pendingLessons.filter((l) => l._id !== lessonId);
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error('Failed to approve lesson');
        this.closeModal();
      },
    });
  }

  rejectLesson(lessonId: string) {
    this.lessonsService.deleteLesson(lessonId).subscribe({
      next: (response) => {
        this.toastr.success('Lesson rejected successfully');
        this.pendingLessons = this.pendingLessons.filter((l) => l._id !== lessonId);
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error('Failed to reject lesson');
        this.closeModal();
      },
    });
  }

  getLessonTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      video: 'Video',
      article: 'Article',
      quiz: 'Quiz',
    };
    return types[type] || type;
  }

  getLessonTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      video: 'bi bi-play-circle-fill',
      article: 'bi bi-file-text-fill',
      quiz: 'bi bi-question-circle-fill',
    };
    return icons[type] || 'bi bi-circle-fill';
  }

  openVideoModal(lesson: Ilesson) {
    if (lesson.videoUrl) {
      const videoId = this.extractYouTubeId(lesson.videoUrl);
      const url = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&enablejsapi=1&origin=${window.location.origin}`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.selectedLesson = lesson;
      this.modalAction = 'video';
      this.isModalOpen = true;
      this.isPlaying = true;
    }
  }

  extractYouTubeId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : '';
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    const iframe = document.querySelector('.video-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      const command = this.isPlaying ? 'playVideo' : 'pauseVideo';
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: '',
        }),
        '*'
      );
    }
  }
}
