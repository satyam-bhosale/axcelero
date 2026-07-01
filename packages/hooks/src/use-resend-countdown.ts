import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

type CountdownState = {
    countdown: number;
    initial: number;
    isRunning: boolean;
}

type CountdownActions =
    { type: 'START' } |
    { type: 'TICK', payload: { step: number } } |
    { type: 'RESTART' } |
    { type: 'RESET' } |
    { type: 'SET_INITIAL', payload: number };

function reducer(state: CountdownState, action: CountdownActions): CountdownState {
    switch (action.type) {
        case 'START':
            if (state.isRunning || state.countdown <= 0) return state;
            return {
                ...state,
                isRunning: true
            }
        case 'TICK':
            const next = Math.max(0, state.countdown - action.payload.step);
            return {
                ...state,
                countdown: next,
                isRunning: next > 0
            }
        case 'RESTART':
            return {
                ...state,
                countdown: state.initial,
                isRunning: true
            }
        case 'RESET':
            return {
                ...state,
                countdown: state.initial,
                isRunning: false
            }
        case 'SET_INITIAL':
            return {
                ...state,
                initial: action.payload,
                countdown: action.payload,
                isRunning: false
            }
        default:
            return state;
    }
}

const STEP = 1;
const INTERVAL = 1000;

export function useResendCodeCountdown(seconds: number) {
    const [state, dispatch] = useReducer(reducer, {
        countdown: seconds,
        initial: seconds,
        isRunning: false
    });

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearIntervalFn = useCallback(() => {
        if (!intervalRef.current) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    const createInterval = useCallback(() => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            dispatch({ type: 'TICK', payload: { step: STEP } });
        }, INTERVAL);
    }, []);

    const startCountdown = useCallback(() => dispatch({ type: 'START' }), []);
    const restartCountdown = useCallback(() => dispatch({ type: 'RESTART' }), []);
    const resetCountdown = useCallback(() => dispatch({ type: 'RESET' }), []);

    useEffect(() => {
        if (state.isRunning) {
            createInterval();
        } else {
            clearIntervalFn();
        }
    }, [state.isRunning, createInterval, clearIntervalFn]);

    useEffect(() => {
        if (seconds !== state.initial) {
            dispatch({ type: "SET_INITIAL", payload: seconds });
        }
    }, [seconds, state.initial]);

    useEffect(() => {
        return () => clearIntervalFn();
    }, [clearIntervalFn])

    const controls = useMemo(() => ({
        startCountdown,
        restartCountdown,
        resetCountdown
    }), [
        startCountdown,
        restartCountdown,
        resetCountdown
    ]);

    return {
        remainingTime: state.countdown,
        isRunning: state.isRunning,
        isCompleted: state.countdown === 0,
        elapsedTime: Math.max(0, state.initial - state.countdown),
        controls
    };

}