import { UserService } from './../../Services/user-service';
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Iuser } from '../../Models/iuser';
import { CategoryService } from '../../Services/category-service';
import { EventService } from '../../Services/event-service';
import { ServiceService } from '../../Services/service-service';
import { UsersMessagesService } from '../../Services/users-messages-service';
import { LessonsService } from '../../Services/lessons-service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  adminData: Iuser = {} as Iuser;

  // -----------------Statistics------------------
  totalUsers: number = 0;
  totalStudents: number = 0;
  totalInstructors: number = 0;
  totalCategories: number = 0;
  totalEvents: number = 0;
  totalServices: number = 0;
  totalMessages: number = 0;
  unreadMessages: number = 0;
  totalLessons: number = 0;

  // ------------------------ USERS DOUGHNUT CHART ------------------------
  public usersChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#0ab99d', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  public usersChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12, weight: 'bold' },
          color: '#4a5568',
        },
      },
    },
  };

  public readonly usersChartType = 'doughnut' as const;

  // ------------------------ STATS BAR CHART ------------------------
  public statsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Categories', 'Events', 'Services', 'Messages', 'Lessons'],
    datasets: [
      {
        label: 'Total Count',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#0ab99d', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  public statsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#6b7280' },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { color: '#4a5568', font: { weight: 'bold' } },
        grid: { display: false },
      },
    },
  };

  public readonly statsChartType = 'bar';

  // ------------------------ MESSAGES LINE CHART ------------------------
  public messagesChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Total Messages', 'Unread', 'Read'],
    datasets: [
      {
        label: 'Messages',
        data: [0, 0, 0],
        borderColor: '#0ab99d',
        backgroundColor: 'rgba(10, 185, 157, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
      },
    ],
  };

  public messagesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#6b7280' },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { color: '#4a5568', font: { weight: 'bold' } },
        grid: { display: false },
      },
    },
  };

  public readonly messagesChartType = 'line';

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private eventService: EventService,
    private serviceService: ServiceService,
    private messagesService: UsersMessagesService,
    private lessonsService: LessonsService
  ) {}

  ngOnInit() {
    this.loadAdminData();
    this.loadStatistics();
  }

  loadAdminData() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userService.getUserById(decodedToken.id).subscribe({
        next: (user) => (this.adminData = user),
        error: (err) => console.error(err),
      });
    }
  }

  // ------------------ LOAD ALL STATISTICS ------------------
  loadStatistics() {
    forkJoin({
      users: this.userService.getUsers(),
      categories: this.categoryService.getAllCategories(),
      events: this.eventService.getEvents(),
      services: this.serviceService.getServices(),
      messages: this.messagesService.getUsersMessages(),
      lessons: this.lessonsService.getPendingLessons(),
    }).subscribe({
      next: (res) => {
        // -------- USERS --------
        this.totalUsers = res.users.length;
        this.totalStudents = res.users.filter((u) => u.role === 'student').length;
        this.totalInstructors = res.users.filter((u) => u.role === 'instructor').length;
        const totalAdmins = res.users.filter((u) => u.role === 'admin').length;

        this.usersChartData = {
          ...this.usersChartData,
          datasets: [
            {
              ...this.usersChartData.datasets[0],
              data: [this.totalStudents, this.totalInstructors, totalAdmins],
            },
          ],
        };

        // -------- CATEGORY / EVENTS / SERVICES / LESSONS --------
        this.totalCategories = res.categories.length || 0;
        this.totalEvents = res.events.length || 0;
        this.totalServices = res.services.length || 0;
        this.totalMessages = res.messages.length || 0;
        this.totalLessons = res.lessons.count || 0;

        this.statsChartData = {
          ...this.statsChartData,
          datasets: [
            {
              ...this.statsChartData.datasets[0],
              data: [
                this.totalCategories,
                this.totalEvents,
                this.totalServices,
                this.totalMessages,
                this.totalLessons,
              ],
            },
          ],
        };

        // -------- MESSAGES --------
        this.unreadMessages = res.messages.filter((m) => !m.isRead).length;
        const read = res.messages.filter((m) => m.isRead).length;

        this.messagesChartData = {
          ...this.messagesChartData,
          datasets: [
            {
              ...this.messagesChartData.datasets[0],
              data: [this.totalMessages, this.unreadMessages, read],
            },
          ],
        };
      },

      error: (err) => console.error('Error loading statistics:', err),
    });
  }
}
