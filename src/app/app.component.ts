import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fadeOutLeftBigOnLeaveAnimation } from 'angular-animations';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [fadeOutLeftBigOnLeaveAnimation()],
})
export class AppComponent implements OnInit, OnDestroy {
    /** Reference to the submit audio element */
    @ViewChild('submitPlayer') submitPlayer: ElementRef;

    /** Reference to the complete audio element */
    @ViewChild('completePlayer') completePlayer: ElementRef;

    /** List of tasks */
    tasks: string[] = [];

    /** New task being added */
    newTask = '';

    /** Whether to show submit form */
    showSubmit = false;

    /** Whether UI should lock */
    isLoading = false;

    /** Index of element in array to bounce */
    bounceIndex: number = null;

    /** Name of the cookie to use for storage */
    readonly cookieName = 'tasks';

    /** Used to handle interval counter observable */
    private intervalSubscription: Subscription;

    constructor() {}

    /**
     * On init lifecycle hook
     */
    ngOnInit(): void {
        this.getTasks();
        this.startInterval();

    }

    /**
     * On destroy lifecycle hook
     */
    ngOnDestroy(): void {
        this.intervalSubscription.unsubscribe();
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

        this.playSound(this.submitPlayer);
        this.tasks = [...this.tasks, this.newTask.trim()];
        this.newTask = '';
        this.setTasks();
    }

    /**
     * Deletes a task from the cookie
     */
    complete(taskToDelete: string): void {
        this.playSound(this.completePlayer);
        this.startInterval();
        this.tasks = this.tasks.filter((task) => task !== taskToDelete);
        this.setTasks();
    }

    /**
     * Plays audio on submission or completion
     */
    private playSound(player: ElementRef): void {
        if (player.nativeElement.paused) {
            player.nativeElement.play();
        } else {
            player.nativeElement.currentTime = 0;
        }
    }

    /**
     * Updates cookie with new list
     */
    private setTasks(): void {
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 0);
        document.cookie = `${this.cookieName}=${this.tasks.join('|')};expires=${midnight.toUTCString()}`;
        this.startInterval();
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
                .split('|')
                .filter((task) => task);
        }
    }

    /**
     * Starts interval to bounce elements
     */
    private startInterval(): void {
        this.intervalSubscription?.unsubscribe();
        this.intervalSubscription = interval(10000).subscribe(() => {
            this.bounceIndex = Math.floor(Math.random()*this.tasks.length)
        })
    }
}
