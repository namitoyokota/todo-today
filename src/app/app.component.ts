import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    /** List of tasks */
    tasks: string[] = [];

    /** New task being added */
    newTask = '';

    /** Whether to show submit form */
    showSubmit = false;

    /** Whether UI should lock */
    isLoading = false;

    /** Name of the cookie to use for storage */
    readonly cookieName = 'tasks';

    constructor() {}

    /**
     * On init lifecycle hook
     */
    ngOnInit(): void {
        this.getTasks();
    }

    /**
     * Adds a new task to the cookie
     */
    submit(): void {
        const hasContent = this.newTask.trim().length;
        if (!hasContent) {
            return;
        }

        const hasDuplicate = this.tasks.includes(this.newTask.trim());
        if (hasDuplicate) {
            return;
        }

        this.tasks = [...this.tasks, this.newTask.trim()];
        this.newTask = '';

        this.setTasks();
    }

    /**
     * Deletes a task from the cookie
     */
    complete(taskToDelete: string): void {
        this.tasks = this.tasks.filter((task) => task !== taskToDelete);
        this.setTasks();
    }

    /**
     * Updates cookie with new list
     */
    private setTasks(): void {
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 0);
        document.cookie = `${this.cookieName}=${this.tasks.join('|')};expires=${midnight.toUTCString()}`;
    }

    /**
     * Retrieves to do tasks from the cookie
     */
    private getTasks(): void {
        if (document.cookie) {
            this.tasks = document.cookie
                .split('; ')
                .find((row) => row.startsWith(`${this.cookieName}=`))
                ?.split('=')[1]
                .split('|');
        }
    }
}
