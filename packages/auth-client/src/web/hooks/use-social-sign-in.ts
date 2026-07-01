import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type SocialSignInFn = WebAuthClient["signIn"]["social"];
type SocialSignInParameters = Parameters<SocialSignInFn>[0];
type SocialSignInData = InferData<SocialSignInFn>;
type SocialSignInError = (NonNullable<InferError<SocialSignInFn>> & RetryAfter) | null;
type SocialSignInResult = Promise<{ data: SocialSignInData, error: SocialSignInError }>;

type SocialSignInMutationState = {
    status: MutationStatus,
    data: SocialSignInData,
    error: SocialSignInError
}

type SocialSignInAction =
    { type: 'START' } |
    { type: 'SUCCESS', payload: SocialSignInData } |
    { type: 'ERROR', payload: SocialSignInError };

type HookReturnType = {
    socialSignIn: (args: SocialSignInParameters) => SocialSignInResult,
    data: SocialSignInData,
    error: SocialSignInError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean
    }
}

function reducer(state: SocialSignInMutationState, action : SocialSignInAction) : SocialSignInMutationState {
    switch (action.type) {
        case 'START' :
            return {
                status: 'pending',
                data: null,
                error: null
            }
        case 'SUCCESS':
            return {
                status: 'success',
                data: action.payload,
                error: null
            }
        case 'ERROR':
            return {
                status: 'error',
                data: null,
                error: action.payload
            }
        default:
            return state
    }
}

const initialState : SocialSignInMutationState = {
    status: 'idle',
    data: null,
    error: null
}

export function useSocialSignIn(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function socialSignIn(args : SocialSignInParameters) {
        let retryAfter = 0;
        dispatch({type: "START"});

        const result = await client.signIn.social(args, {
            onError: (ctx : ErrorContext) => {
                const {retryAfter : rawRetryAfter} = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if(result.error){
            dispatch({type: 'ERROR', payload: {...result.error, retryAfter}});
            return {data: null, error: {...result.error, retryAfter}};
        }

        dispatch({type: 'SUCCESS', payload: result.data});
        return result;
    }

    const result : HookReturnType = {
        socialSignIn,
        data: state.data,
        error: state.error,
        status:{
            isIdle: state.status === 'idle',
            isPending: state.status === 'pending',
            isSuccess: state.status === 'success',
            isError: state.status === 'error'
        }
    }

    return result;
}