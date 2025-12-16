import { Component, OnInit } from '@angular/core';
import { UsersMessagesService } from '../../Services/users-messages-service';
import { IusersMessages } from '../../Models/iusers-messages';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Loader } from "../loader/loader";

@Component({
  selector: 'app-users-messages',
  imports: [CommonModule, FormsModule, Loader],
  templateUrl: './users-messages.html',
  styleUrl: './users-messages.scss',
})
export class UsersMessages implements OnInit {
  messages: IusersMessages[] = [];
  allMessages: IusersMessages[] = [];
  isDeleteModalOpen: boolean = false;
  isMessgaeModalOpen: boolean = false;
  messageContent: string = '';
  selectedMessageId: string | null = null;
  searchTerm: string = '';
  currentFilter: 'all' | 'read' | 'unread' = 'all';
  loading: boolean = true;

  constructor(private usersMessagesService: UsersMessagesService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.usersMessagesService.getUsersMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.allMessages = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user messages:', error);
        this.loading = false;
      },
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.messages = this.allMessages.filter((message) => {
      // ------------filter by search term------------
      const matchesSearch = [message.name, message.email, message.subject].some((field) =>
        field.toLowerCase().includes(term)
      );

      // ------------filter by read/unread status------------
      let matchesFilter = true;
      if (this.currentFilter === 'read') matchesFilter = message.isRead;
      if (this.currentFilter === 'unread') matchesFilter = !message.isRead;

      return matchesSearch && matchesFilter;
    });
  }

  setFilter(filter: 'all' | 'read' | 'unread') {
    this.currentFilter = filter;
    this.onSearch();
  }

  openDeleteModal(id: string) {
    this.selectedMessageId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  openMessgaeModal(message: IusersMessages) {
    this.messageContent = message.message;
    if (!message.isRead) {
      this.usersMessagesService.markMessageAsRead(message._id).subscribe(() => {
        message.isRead = true;
      });
    }
    this.isMessgaeModalOpen = true;
  }

  closeMessageModal() {
    this.isMessgaeModalOpen = false;
  }

  confirmDelete() {
    if (!this.selectedMessageId) return;

    this.usersMessagesService.deleteUserMessage(this.selectedMessageId).subscribe({
      next: () => {
        this.messages = this.messages.filter((m) => m._id !== this.selectedMessageId);
        this.allMessages = this.allMessages.filter((m) => m._id !== this.selectedMessageId);
        this.toastr.success('Message deleted successfully');
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting message:', error);
        this.toastr.error('Failed to delete message');
        this.closeDeleteModal();
      }
    });
  }
}
