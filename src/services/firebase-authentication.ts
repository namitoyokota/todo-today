import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { GithubAuthProvider, User, deleteUser, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FirebaseAuthentication {
    /** Currently logged in user */
    currentUser = new BehaviorSubject<User>(null);

    /** Currently logged in user */
    currentUser$ = this.currentUser.asObservable();

    constructor() {
        initializeApp(environment.firebase);

        this.listenToAuthChange();
    }

    /**
     * Logs in user with GitHub account
     */
    async signIn(): Promise<void> {
        return new Promise((resolve, reject) => {
            signInWithPopup(getAuth(), new GithubAuthProvider())
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject(error);
                });
        });
    }

    /**
     * Logs out currently logged in user
     */
    async signOut(): Promise<void> {
        return new Promise((resolve, reject) => {
            signOut(getAuth())
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject();
                });
        });
    }

    /**
     * Delete user's account and their data
     */
    async deleteAccount(): Promise<void> {
        return new Promise((resolve, reject) => {
            deleteUser(getAuth().currentUser)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject();
                });
        });
    }

    /**
     * Listen to change in log in state
     */
    private listenToAuthChange(): void {
        onAuthStateChanged(getAuth(), (user: User) => {
            if (user) {
                this.currentUser.next(user);
            } else {
                this.currentUser.next(null);
            }
        });
    }
}
