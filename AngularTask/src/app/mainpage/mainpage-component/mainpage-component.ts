import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mainpage-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './mainpage-component.html',
  styleUrl: './mainpage-component.css',
})
export class MainpageComponent {
   taskTitle = '';
  selectedProject = 'Personal';

  tasks = [
    {
      title: 'Complete Angular UI implementation',
      project: 'Personal',
      due: 'Today',
      completed: false
    },
    {
      title: 'Integrate Backend API',
      project: 'Work',
      due: 'Tomorrow',
      completed: false
    },
    {
      title: 'Design database schema',
      project: 'Work',
      due: 'Yesterday',
      completed: true
    }
  ];

  addTask() {
    if (this.taskTitle.trim()) {
      this.tasks.push({
        title: this.taskTitle,
        project: this.selectedProject,
        due: 'Today',
        completed: false
      });
      this.taskTitle = '';
    }
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  toggleTask(task: any) {
    task.completed = !task.completed;
  }
}
