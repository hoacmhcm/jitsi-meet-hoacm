import { Excalidraw, exportToBlob } from '@jitsi/excalidraw';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { WithTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// @ts-expect-error
import Filmstrip from '../../../../../modules/UI/videolayout/Filmstrip';
import { IReduxState } from '../../../app/types';
import { translate } from '../../../base/i18n/functions';
import { getLocalParticipant } from '../../../base/participants/functions';
import { getVerticalViewMaxWidth } from '../../../filmstrip/functions.web';
import { getToolboxHeight } from '../../../toolbox/functions.web';
import { shouldDisplayTileView } from '../../../video-layout/functions.any';
import { resetWhiteboard, setWhiteboardOpen } from '../../actions';
import { WHITEBOARD_UI_OPTIONS } from '../../constants';
import { isWhiteboardOpen, isWhiteboardVisible } from '../../functions';

import { CountdownTimer } from './countdownTimer';


/**
 * Space taken by meeting elements like the subject and the watermark.
 */
const HEIGHT_OFFSET = 80;

interface IDimensions {

    /* The height of the component. */
    height: string;

    /* The width of the component. */
    width: string;
}

/**
 * The Whiteboard component.
 *
 * @param {Props} props - The React props passed to this component.
 * @returns {JSX.Element} - The React component.
 */
const Whiteboard = (props: WithTranslation): JSX.Element => {
    const dispatch = useDispatch();
    const excalidrawRef = useRef<any>(null);
    const collabAPIRef = useRef<any>(null);

    const isOpen = useSelector(isWhiteboardOpen);
    const isVisible = useSelector(isWhiteboardVisible);
    const isInTileView = useSelector(shouldDisplayTileView);
    const { clientHeight, clientWidth } = useSelector(
        (state: IReduxState) => state['features/base/responsive-ui']
    );
    const { visible: filmstripVisible, isResizing } = useSelector(
        (state: IReduxState) => state['features/filmstrip']
    );
    const filmstripWidth: number = useSelector(getVerticalViewMaxWidth);

    // const collabDetails = useSelector(getCollabDetails);
    // const collabServerUrl = useSelector(getCollabServerUrl);
    const { defaultRemoteDisplayName } = useSelector(
        (state: IReduxState) => state['features/base/config']
    );

    const { local } = useSelector(
        (state: IReduxState) => state['features/base/participants']);

    const { conference, room } = useSelector(
        (state: IReduxState) => state['features/base/conference']);

    const config = useSelector(
        (state: IReduxState) => state['features/base/config']);

    const endTime = config?.test_time ? new Date().getTime() + config?.test_time * 60 : new Date().getTime() + ( 60 * 1000);
    const countdown = config?.test_time ? config?.test_time * 60 :  (60 * 1000);

    console.log('endTime', endTime, config?.test_time, countdown);

    const blobToFile = (blobData: Blob | undefined, fileName: string, fileType: string) => {
        if (!blobData) {
            return;
        }

        // Create a new File object
        const file = new File([ blobData ], fileName, { type: fileType });

        return file;
    };

    const exportTo = async () => {
        if (!excalidrawRef) {
            return;
        }


        // setBlob(blobData);
        return await exportToBlob({
            elements: excalidrawRef.current?.getSceneElements(),
            mimeType: 'image/png',
            appState: excalidrawRef.current?.getAppState(),
            files: excalidrawRef.current?.getFiles(),
            quality: 1
        });
    };


    const localParticipantName
        = useSelector(getLocalParticipant)?.name
        || defaultRemoteDisplayName
        || 'Fellow Jitster';

    useEffect(() => {
        if (!collabAPIRef.current) {
            return;
        }

        collabAPIRef.current.setUsername(localParticipantName);
    }, [ localParticipantName ]);

    useEffect(() => {
        if (isOpen && isVisible) {
            setTimeout(() => {
                exportTo().then((blobData: Blob | undefined) => {
                    dispatch(setWhiteboardOpen(false));
                    dispatch(resetWhiteboard());

                    const file: File | undefined = blobToFile(blobData, 'whiteboard.png', 'image/png');
                    const formData: FormData = new FormData();

                    if (file !== undefined) {
                        formData.append('file', file);
                    }

                    if (local?.name !== undefined) {
                        formData.append('name', local?.name);
                    }

                    if (local?.id !== undefined) {
                        formData.append('uid', local.id);
                    }

                    if (room !== undefined) {
                        formData.append('roomName', room);
                    }

                    if (conference?.sessionId !== undefined) {
                        formData.append('sessionId', conference?.sessionId);
                    }

                    try {
                        fetch(`${config?.ocr_url}/api/upload-image`, {
                            method: 'POST',
                            body: formData
                        }).then();


                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                });

                // dispatch(toggleWhiteboard());
                // dispatch(resetWhiteboard());
            }, countdown);
        }
    }, [ isOpen, isVisible ]);

    /**
     * Computes the width and the height of the component.
     *
     * @returns {IDimensions} - The dimensions of the component.
     */
    const getDimensions = (): IDimensions => {
        let width: number;
        let height: number;

        if (interfaceConfig.VERTICAL_FILMSTRIP) {
            if (filmstripVisible) {
                width = clientWidth - filmstripWidth;
            } else {
                width = clientWidth;
            }
            height = clientHeight - getToolboxHeight();
        } else {
            if (filmstripVisible) {
                height = clientHeight - Filmstrip.getFilmstripHeight();
            } else {
                height = clientHeight;
            }
            width = clientWidth;
        }

        return {
            width: `${width}px`,
            height: `${height - HEIGHT_OFFSET}px`
        };
    };

    // const getExcalidrawAPI = useCallback(excalidrawAPI => {
    //     if (excalidrawAPIRef.current) {
    //         return;
    //     }
    //     excalidrawAPIRef.current = excalidrawAPI;
    // }, []);

    // const getCollabAPI = useCallback(collabAPI => {
    //     if (collabAPIRef.current) {
    //         return;
    //     }
    //     collabAPIRef.current = collabAPI;
    //     collabAPIRef.current.setUsername(localParticipantName);
    // }, [ localParticipantName ]);

    return (
        <div
            className = { clsx(
                isResizing && 'disable-pointer',
                'whiteboard-container'
            ) }
            style = {{
                ...getDimensions(),
                marginTop: `${HEIGHT_OFFSET}px`,
                display: `${isInTileView || !isVisible ? 'none' : 'block'}`
            }}>
            {isOpen && (
                <>
                    <CountdownTimer targetDate = { endTime } />
                    <div className = 'excalidraw-wrapper'>
                        {

                            /*
                             * Excalidraw renders a few lvl 2 headings. This is
                             * quite fortunate, because we actually use lvl 1
                             * headings to mark the big sections of our app. So make
                             * sure to mark the Excalidraw context with a lvl 1
                             * heading before showing the whiteboard.
                             */
                            <span
                                aria-level = { 1 }
                                className = 'sr-only'
                                role = 'heading'>
                                {props.t('whiteboard.accessibilityLabel.heading')}
                            </span>
                        }
                        <Excalidraw
                            UIOptions = { WHITEBOARD_UI_OPTIONS }
                            isCollaborating = { true }
                            initialData={{
                                appState: {
                                    activeTool:
                                        {
                                            "type": "freedraw",
                                        },
                                    currentItemStrokeColor: '#000000',
                                    currentItemStrokeStyle: 'solid',
                                    currentItemStrokeWidth: 0.5,
                                    currentItemBackgroundColor: 'transparent',
                                    currentItemFillStyle: 'solid',
                                    penMode: true,
                                    penDetected: true,
                                    exportBackground: true,
                                }
                            }}
                            // @ts-ignore
                            ref = { excalidrawRef } />
                    </div>
                </>

            )}
        </div>
    );
};

export default translate(Whiteboard);
