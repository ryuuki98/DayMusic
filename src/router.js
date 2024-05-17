import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Main from './components/module/Main';
const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            children: [
                {
                    path: "",
                    element: <Main/>
                }
            ],
        },
        {
            path: '/user',
            element: <Root />,
            children: [
                {
                    path: '',
                    element: (
                        <>
                            <h4>ㅇㅇ</h4>
                        </>
                    ),
                },
            ],
        },
    ],
    {
        basename: '/DayMusic',
    }
);
export default router;