import { IStore } from '../app/types';

import { setWhiteboardOpen } from './actions';
import { isWhiteboardAllowed, isWhiteboardOpen, isWhiteboardVisible } from './functions';
import { WhiteboardStatus } from './types';


/**
 * API to toggle the whiteboard.
 *
 * @returns {Function}
 */
export function toggleWhiteboard() {
    console.log('toggleWhiteboard');
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const isAllowed = isWhiteboardAllowed(state);
        const isOpen = isWhiteboardOpen(state);

        console.log('toggleWhiteboard', isAllowed, isOpen);

        if (isAllowed) {
            if (isOpen && !isWhiteboardVisible(state)) {
                dispatch(setWhiteboardOpen(true));
            } else if (isOpen && isWhiteboardVisible(state)) {
                dispatch(setWhiteboardOpen(false));
            } else if (!isOpen) {
                dispatch(setWhiteboardOpen(true));
            }
        } else if (typeof APP !== 'undefined') {
            APP.API.notifyWhiteboardStatusChanged(WhiteboardStatus.FORBIDDEN);
        }
    };
}
