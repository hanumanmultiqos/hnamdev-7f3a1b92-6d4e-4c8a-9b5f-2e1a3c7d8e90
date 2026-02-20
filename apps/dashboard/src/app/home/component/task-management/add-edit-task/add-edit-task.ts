import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskService } from '../task.service';
import { HelperService } from '../../../../core/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../../../core/services/api-list';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-add-edit-task',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [Api, ApiService, TaskService],
  templateUrl: './add-edit-task.html',
  styleUrl: './add-edit-task.scss',
})
export class AddEditTask {
  private fb = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _helper = inject(HelperService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  taskForm: FormGroup;
  categories = ['WORK', 'PERSONAL'];
  statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
  userList = signal<any[]>([]);
  editMode = '';
  taskId: any;

  constructor() {
    this.getUserList();
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      status: ['', Validators.required],
      assignedToId: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        ],
      ],
    });
    this.taskId = this._route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.editMode = 'Edit';
      this.getDetails();
    } else {
      this.editMode = 'Add';
    }
  }

  getDetails() {
    this._taskService.view(this.taskId).subscribe((res: any) => {
      if (res) {
        this.getFormValue(res);
      } else {
        this._helper.toast(res?.message, 'error');
        this.goBack();
      }
    });
  }

  getUserList() {
    this._taskService.listAssignUser().subscribe((res: any) => {
      if (res) {
        this.userList?.set(res);
      } else {
        this._helper.toast(res?.message, 'error');
      }
    });
  }

  getFormValue(data: any) {
    this.taskForm.patchValue({
      title: data?.title,
      description: data?.description,
      category: data?.category,
      status: data?.status,
      assignedToId: data?.assignedToId,
    });
  }

  onSubmit() {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.valid) {
      const reqData: any = { ...this.taskForm.value };
      // if (this.editMode == 'Edit') {
      //   reqData.id = this.taskId;
      // }
      this._taskService.addEdit(reqData, this.editMode, this.taskId).subscribe(
        (res: any) => {
          if (res) {
            if (this.editMode == 'Edit') {
              this._helper.toast('task updated Successfully!', 'success');
            } else {
              this._helper.toast('task Added Successfully!', 'success');
            }

            this.goBack();
          } else {
            this._helper.toast(res.message, 'error');
          }
        },
        (error: any) => {
          this._helper.toast(error.message, 'error');
        },
      );
    }
  }

  goBack() {
    this._router.navigate(['task-management/list']);
  }
}
