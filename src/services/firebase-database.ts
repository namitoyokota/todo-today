import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
    CollectionReference,
    DocumentData,
    Firestore,
    QuerySnapshot,
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from 'firebase/firestore/lite';
import { BehaviorSubject } from 'rxjs';
import { Idea } from 'src/abstractions/idea';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FirebaseDatabase {
    /** Flag to indicate when API call is being made */
    private isLoading = new BehaviorSubject<boolean>(true);

    /** Flag to indicate when API call is being made */
    isLoading$ = this.isLoading.asObservable();

    /** Copy of the currently loaded ideas */
    private ideas = new BehaviorSubject<Idea[]>([]);

    /** Copy of the currently loaded ideas */
    ideas$ = this.ideas.asObservable();

    /** Firebase app to access database */
    private firebaseApp: FirebaseApp;

    /** Firebase database */
    private firebaseDb: Firestore;

    /** Table in the firebase database */
    private ideasCollection: CollectionReference<DocumentData>;

    /** Current state of the firebase database */
    private ideasSnapshot: QuerySnapshot<DocumentData>;

    /** Collection id for the current user */
    private readonly collectionId = 'ideas';

    constructor() {
        this.initialize();
    }

    /**
     * Gets the latest list of ideas in the database
     * @param collectionId Database collection id
     */
    async getIdeas(): Promise<void> {
        this.ideasCollection = collection(this.firebaseDb, this.collectionId);
        getDocs(this.ideasCollection).then((ideasSnapshot) => {
            this.ideasSnapshot = ideasSnapshot;

            this.ideas.next(
                this.ideasSnapshot.docs.map((doc) => {
                    return new Idea(
                        doc.data()['id'],
                        doc.data()['title'],
                        doc.data()['description'],
                        doc.data()['tags'],
                        doc.data()['votes'],
                        doc.data()['userId'],
                        doc.data()['displayName'],
                        doc.data()['photoURL'],
                        doc.data()['date'],
                    );
                }),
            );

            this.stopLoading();
        });
    }

    /**
     * Create a new idea in the database
     * @param idea New object to send to firebase db
     */
    async addIdea(idea: Idea): Promise<void> {
        return new Promise((resolve, reject) => {
            addDoc(this.ideasCollection, {
                id: idea.id,
                title: idea.title,
                description: idea.description,
                tags: idea.tags,
                votes: idea.votes,
                userId: idea.userId,
                displayName: idea.displayName,
                photoURL: idea.photoURL,
                date: idea.date,
            })
                .then(async () => {
                    await this.getIdeas();
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject();
                });
        });
    }

    /**
     * Update an existing idea in the database
     * @param idea Idea object to update
     */
    async updateIdea(idea: Idea): Promise<void> {
        const ideaDoc = this.findIdeaDoc(idea);

        return new Promise((resolve, reject) => {
            updateDoc(ideaDoc, {
                id: idea.id,
                title: idea.title,
                description: idea.description,
                tags: idea.tags,
                votes: idea.votes,
                userId: idea.userId,
                displayName: idea.displayName,
                photoURL: idea.photoURL,
                date: idea.date,
            })
                .then(async () => {
                    await this.getIdeas();
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    reject();
                });
        });
    }

    /**
     * Removes an existing idea from the database
     * @param idea Idea object to remove from db
     */
    async removeIdea(idea: Idea): Promise<void> {
        this.startLoading();

        const ideaDoc = this.findIdeaDoc(idea);

        return new Promise((resolve, reject) => {
            deleteDoc(ideaDoc)
                .then(async () => {
                    await this.getIdeas();
                    this.stopLoading();
                    resolve();
                })
                .catch((error) => {
                    console.warn(error);
                    this.stopLoading();
                    reject();
                });
        });
    }

    /**
     * Returns idea in the database
     * @param Idea object to find
     */
    private findIdeaDoc(idea: Idea) {
        let ideaDoc;
        this.ideasSnapshot.docs.forEach((doc) => {
            const ideaSnapshot: any = doc.data();
            if (ideaSnapshot.id === idea.id) {
                ideaDoc = doc.ref;
            }
        });

        return ideaDoc;
    }

    /**
     * Initializes firebase access
     */
    private initialize() {
        this.firebaseApp = initializeApp(environment.firebase);
        this.firebaseDb = getFirestore(this.firebaseApp);

        // TODO: Added after going production
        // const analytics = getAnalytics(this.firebaseApp);
    }

    /**
     * Turn on loading flag
     */
    private startLoading(): void {
        this.isLoading.next(true);
    }

    /**
     * Turn off loading flag
     */
    private stopLoading(): void {
        this.isLoading.next(false);
    }
}
