import {
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from 'react-router-dom';
import { LoginView } from '../views/login-view/login-view';
import { DashboardView } from '../views/dashboard-view/dashboard-view';
import { MainLayout } from '../layouts/main-layout';
import { MatchCreateView } from '../views/match-create-view/match-create-view';
import MatchDetailsView from '../views/match-details-view/match-details-view';
import MatchRoomView from '../views/match-room-view/match-room-view';
import { RegisterView } from '../views/register-view/register-view';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/*" element={<MainLayout />}>
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="matches/create" element={<MatchCreateView />} />
                <Route path="matches/:matchId" element={<MatchDetailsView />}/>
                <Route path="game/:matchId" element={<MatchRoomView />}/>
            </Route>  
        </>
    )
);

