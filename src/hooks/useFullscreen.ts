import { useState, useCallback, useEffect, useRef } from 'react';

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

type DocumentWithFullscreen = Document & {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitIsFullScreen?: boolean;
  mozFullScreen?: boolean;
  msFullscreenElement?: Element | null;
};

interface UseFullscreenReturn {
  /** Whether the element is currently in fullscreen mode */
  isFullscreen: boolean;
  /** Whether fullscreen API is supported by the browser */
  isSupported: boolean;
  /** Whether the browser is a mobile device */
  isMobile: boolean;
  /** Enter fullscreen mode for the specified element */
  enter: (element?: HTMLElement) => Promise<void>;
  /** Exit fullscreen mode */
  exit: () => Promise<void>;
  /** Toggle fullscreen mode for the specified element */
  toggle: (element?: HTMLElement) => Promise<void>;
  /** Error message if fullscreen operation failed */
  error: string | null;
  /** Whether a fullscreen operation is in progress */
  isLoading: boolean;
}

/**
 * Hook to handle fullscreen functionality with cross-browser support
 * @returns {UseFullscreenReturn} Object containing fullscreen state and methods
 */
const useFullscreen = (): UseFullscreenReturn => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  // Check if fullscreen is supported
  const isSupported = useCallback((): boolean => {
    const doc = document as DocumentWithFullscreen;
    return !!(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
  }, []);

  // Check if device is mobile
  const isMobile = useCallback((): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  // Get the appropriate fullscreen methods based on browser
  const getFullscreenMethods = useCallback((element: FullscreenElement) => {
    if (element.requestFullscreen) {
      return {
        request: () => element.requestFullscreen(),
        exit: () => (document as DocumentWithFullscreen).exitFullscreen?.(),
      };
    }
    if (element.webkitRequestFullscreen) {
      return {
        request: () => element.webkitRequestFullscreen!(),
        exit: () => (document as DocumentWithFullscreen).webkitExitFullscreen?.(),
      };
    }
    if (element.mozRequestFullScreen) {
      return {
        request: () => element.mozRequestFullScreen!(),
        exit: () => (document as DocumentWithFullscreen).mozCancelFullScreen?.(),
      };
    }
    if ((element as any).msRequestFullscreen) {
      return {
        request: () => (element as any).msRequestFullscreen(),
        exit: () => (document as any).msExitFullscreen(),
      };
    }
    return { request: null, exit: null };
  }, []);

  // Handle fullscreen change events
  const handleFullscreenChange = useCallback(() => {
    const doc = document as DocumentWithFullscreen;
    const isFull = !!(
      doc.fullscreenElement ||
      doc.webkitIsFullScreen ||
      doc.mozFullScreen ||
      doc.msFullscreenElement
    );
    setIsFullscreen(isFull);
    setError(null);
    setIsLoading(false);
  }, []);

  // Handle fullscreen errors
  const handleFullscreenError = useCallback((err: Error) => {
    console.error('Fullscreen error:', err);
    setError('Failed to enter fullscreen mode. Your browser may not support this feature.');
    setIsLoading(false);
  }, []);

  // Enter fullscreen mode
  const enter = useCallback(
    async (element: HTMLElement = document.documentElement) => {
      if (!isSupported()) {
        setError('Fullscreen is not supported by your browser');
        return;
      }

      try {
        setIsLoading(true);
        elementRef.current = element;
        const methods = getFullscreenMethods(element);
        
        if (methods.request) {
          await methods.request();
        } else {
          throw new Error('Fullscreen method not available');
        }
      } catch (err) {
        handleFullscreenError(err as Error);
      }
    },
    [getFullscreenMethods, handleFullscreenError, isSupported]
  );

  // Exit fullscreen mode
  const exit = useCallback(async () => {
    if (!isFullscreen) return;

    try {
      setIsLoading(true);
      const doc = document as DocumentWithFullsheet;
      
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if ((doc as any).msExitFullscreen) {
        await (doc as any).msExitFullscreen();
      } else {
        throw new Error('Exit fullscreen method not available');
      }
    } catch (err) {
      handleFullscreenError(err as Error);
    }
  }, [isFullscreen, handleFullscreenError]);

  // Toggle fullscreen mode
  const toggle = useCallback(
    async (element: HTMLElement = document.documentElement) => {
      if (isFullscreen) {
        await exit();
      } else {
        await enter(element);
      }
    },
    [enter, exit, isFullscreen]
  );

  // Set up event listeners
  useEffect(() => {
    if (!isSupported()) {
      setError('Fullscreen is not supported by your browser');
      return;
    }

    const doc = document as DocumentWithFullsheet;
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    // Initial check
    handleFullscreenChange();

    // Clean up event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [handleFullscreenChange, isSupported]);

  return {
    isFullscreen,
    isSupported: isSupported(),
    isMobile: isMobile(),
    enter,
    exit,
    toggle,
    error,
    isLoading,
  };
};

export default useFullscreen;
