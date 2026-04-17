/**
 * Onboarding form state management
 */

export interface OnboardingState {
    step: 1 | 2 | 3 | 4;
    action: 'search' | 'create' | null;
    searchQuery: string;
    selectedSacco: { id: string; name: string; location: string } | null;
    chamaName: string;
    chamaType: 'SACCO' | 'TableBanking' | 'MerryGoRound';
    chamaDescription: string;
    members: Array<{ email: string; role: 'admin' | 'member' }>;
    isSubmitting: boolean;
    error: string | null;
}

export const initialOnboardingState: OnboardingState = {
    step: 1,
    action: null,
    searchQuery: '',
    selectedSacco: null,
    chamaName: '',
    chamaType: 'SACCO',
    chamaDescription: '',
    members: [],
    isSubmitting: false,
    error: null,
};

export type OnboardingAction =
    | { type: 'SET_STEP'; payload: 1 | 2 | 3 | 4 }
    | { type: 'SET_ACTION'; payload: 'search' | 'create' | null }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_SELECTED_SACCO'; payload: { id: string; name: string; location: string } | null }
    | { type: 'SET_CHAMA_NAME'; payload: string }
    | { type: 'SET_CHAMA_TYPE'; payload: 'SACCO' | 'TableBanking' | 'MerryGoRound' }
    | { type: 'SET_CHAMA_DESCRIPTION'; payload: string }
    | { type: 'ADD_MEMBER'; payload: { email: string; role: 'admin' | 'member' } }
    | { type: 'REMOVE_MEMBER'; payload: string }
    | { type: 'UPDATE_MEMBER_ROLE'; payload: { email: string; role: 'admin' | 'member' } }
    | { type: 'SET_MEMBERS'; payload: Array<{ email: string; role: 'admin' | 'member' }> }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET' };

export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_ACTION':
            return { ...state, action: action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SELECTED_SACCO':
            return { ...state, selectedSacco: action.payload };
        case 'SET_CHAMA_NAME':
            return { ...state, chamaName: action.payload };
        case 'SET_CHAMA_TYPE':
            return { ...state, chamaType: action.payload };
        case 'SET_CHAMA_DESCRIPTION':
            return { ...state, chamaDescription: action.payload };
        case 'ADD_MEMBER':
            return {
                ...state,
                members: [...state.members, action.payload],
            };
        case 'REMOVE_MEMBER':
            return {
                ...state,
                members: state.members.filter(m => m.email !== action.payload),
            };
        case 'UPDATE_MEMBER_ROLE':
            return {
                ...state,
                members: state.members.map(m =>
                    m.email === action.payload.email
                        ? { ...m, role: action.payload.role }
                        : m
                ),
            };
        case 'SET_MEMBERS':
            return { ...state, members: action.payload };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET':
            return initialOnboardingState;
        default:
            return state;
    }
}
