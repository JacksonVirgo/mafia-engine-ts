import { db } from "../../app/database/database";
import { Signup, SignupEvent } from "../../database/signups";
import { UsergroupEvent } from "../../database/usergroups";


export type LooseSignupEvent =
    | {
        type: 'signup';
        signupEvent: SignupEvent;
        createdAt: Date;
    }
    | {
        type: 'usergroup';
        usergroupEvent: UsergroupEvent;
        createdAt: Date;
    };


interface CollectedSignup {
    signup: Signup,
    events: LooseSignupEvent[]
}

export async function collectSignup(signupId: number): Promise<CollectedSignup | null> {
    const signup = await db.query.signups.findFirst({
        where: (fields, { eq }) => eq(fields.id, signupId),
    });

    if (!signup) return null;

    const signupEvents = await db.query.signupEvents.findMany({
        where: (fields, { eq }) => eq(fields.signup_id, signup.id),
    });

    const signupUsergroups = await db.query.signupUsergroups.findMany({
        where: (fields, { eq }) => eq(fields.signup_id, signup.id),
        columns: { usergroup_id: true },
    });

    const usergroupIds = signupUsergroups.map(g => g.usergroup_id);

    const usergroupEvents = await db.query.usergroupEvents.findMany({
        where: (fields, { inArray }) => inArray(fields.usergroup_id, usergroupIds),
    });

    const allEvents: LooseSignupEvent[] = [
        ...signupEvents.map((v) => ({
            type: "signup" as const,
            signupEvent: v,
            createdAt: v.createdAt,
        })),
        ...usergroupEvents.map((v) => ({
            type: "usergroup" as const,
            usergroupEvent: v,
            createdAt: v.createdAt,
        })),
    ];

    return {
        signup,
        events: allEvents,
    };
}

interface CalculatedUsergroup {
    id: number,
    name: string,
    interactiveName?: string,
    isHoisted: boolean,
    users: Map<string, {
        id: string,
        name: string
    }>
}

interface CalculatedSignup {
    name: string,
    isAnonymous: boolean,
    usergroups: Map<number, CalculatedUsergroup>
}

export async function calculateSignup(collected: CollectedSignup) {
    let sorted = collected.events.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const calculated: CalculatedSignup = {
        name: "Signup",
        isAnonymous: false,
        usergroups: new Map()
    };

    for (const event of sorted) {
        if (event.type == 'signup') {
            const e = event.signupEvent;

            if (e.isAnonymous != null) calculated.isAnonymous = e.isAnonymous;
            if (e.name != null) calculated.name = e.name;
            if (e.usergroupRef != null) {
                let usergroup = calculated.usergroups.get(e.usergroupRef);
                if (!usergroup)
                    usergroup = {
                        id: e.usergroupRef,
                        name: "Usergroup",
                        interactiveName: undefined,
                        isHoisted: false,
                        users: new Map(),
                    }

                if (e.hoistUsergroup != null) usergroup.isHoisted = e.hoistUsergroup ?? false;
                if (e.interactiveName) usergroup.interactiveName = e.interactiveName;
            }
        } else {
            const e = event.usergroupEvent;
            let userRef = e.userRef;
            let usergroupId = e.id;

            let usergroup = calculated.usergroups.get(usergroupId);
            if (!usergroup)
                usergroup = {
                    id: usergroupId,
                    name: "Usergroup",
                    interactiveName: undefined,
                    isHoisted: false,
                    users: new Map(),
                }

            if (e.name) usergroup.name = e.name;
            if (userRef) {
                if (e.userAdded)
                    usergroup.users.set(userRef, { id: userRef, name: userRef });
                if (e.userRemoved) usergroup.users.delete(userRef);
            }
        }
    }

    return calculated;
}

export async function formatSignup() { }
