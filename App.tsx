import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Podium } from './components/Podium';
import { Table } from './components/Table';
import { CoursePaths } from './components/CoursePaths';
import { LabsGrid } from './components/LabsGrid';
import { TeamPath } from './components/TeamPath';
import { CourseContent } from './components/CourseContent';
import { LabEnvironment } from './components/LabEnvironment';
import { Dashboard } from './components/Dashboard';
import { Arena } from './components/Arena';
import { AdminPanel } from './components/AdminPanel';
import { Profile } from './components/Profile';
import { Course, User, CourseModule } from './types';

type ViewState = 'dashboard' | 'auth' | 'courses' | 'labs' | 'leaderboard' | 'red-path' | 'blue-path' | 'course-content' | 'lab-active' | 'arena' | 'admin' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Dynamic Content State (CRUD-able)
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [modulesList, setModulesList] = useState<Record<string, CourseModule>>({});
  const [leaderboardList, setLeaderboardList] = useState<User[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
    }

    // Check for logged in user
    const storedUser = localStorage.getItem('brainloom_user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse stored user", e);
            localStorage.removeItem('brainloom_user');
        }
    }

    // Fetch modules from API
    const fetchModules = async () => {
        try {
            const response = await fetch('https://cyber.brainloom.in/api/modules');
            const data = await response.json();
            if (data.success && data.modules) {
                const apiCourses: Course[] = data.modules.map((m: any) => ({
                    id: m.id.toString(),
                    title: m.title,
                    description: m.description,
                    difficulty: m.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
                    progress: m.progress || 0,
                    timeEstimate: m.time_estimate,
                    xpReward: m.xp_reward,
                    category: m.category as 'Red Team' | 'Blue Team',
                    icon: m.icon,
                    topics: typeof m.topics === 'string' ? JSON.parse(m.topics) : m.topics
                }));
                
                setCoursesList(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const newUnique = apiCourses.filter(c => !existingIds.has(c.id));
                    return [...prev, ...newUnique];
                });

                // Fetch content for each module
                for (const module of data.modules) {
                    try {
                        const contentResponse = await fetch(`https://cyber.brainloom.in/api/modules/${module.id}/content`);
                        const contentData = await contentResponse.json();
                        
                        // User request says the response might be a stringified JSON
                        let parsedEducation;
                        if (typeof contentData === 'string') {
                            parsedEducation = JSON.parse(contentData);
                        } else if (contentData.content) {
                            parsedEducation = typeof contentData.content === 'string' ? JSON.parse(contentData.content) : contentData.content;
                        } else {
                            parsedEducation = contentData;
                        }

                        setModulesList(prev => ({
                            ...prev,
                            [module.id.toString()]: {
                                id: module.id.toString(),
                                education: parsedEducation,
                                labConfig: module.lab_config 
                                    ? (typeof module.lab_config === 'string' ? JSON.parse(module.lab_config) : module.lab_config)
                                    : (contentData.lab_config 
                                        ? (typeof contentData.lab_config === 'string' ? JSON.parse(contentData.lab_config) : contentData.lab_config)
                                        : { type: 'REPEATER', urlBar: 'localhost', steps: [] }) // Default fallback
                            }
                        }));
                    } catch (err) {
                        console.error(`Failed to fetch content for module ${module.id}:`, err);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch modules:", error);
        }
    };
    fetchModules();

    // Fetch leaderboard from API
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('https://cyber.brainloom.in/api/leaderboard');
            const data = await response.json();
            if (data.success && data.leaderboard) {
                const mappedLeaderboard: User[] = data.leaderboard.map((entry: any, index: number) => ({
                    id: `lb-${index}-${entry.username}`,
                    name: entry.username,
                    handle: `@${entry.username.toLowerCase().replace(/\s+/g, '')}`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`,
                    level: entry.level,
                    xp: entry.xp,
                    rank: index + 1,
                    badges: [],
                    isPro: entry.xp > 1000
                }));
                setLeaderboardList(mappedLeaderboard);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        }
    };
    fetchLeaderboard();
  }, []);

  const toggleTheme = () => {
      const newDark = !isDark;
      setIsDark(newDark);
      if (newDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
      }
  };

  const handleLogin = (newUser: User) => {
      setUser(newUser);
      localStorage.setItem('brainloom_user', JSON.stringify(newUser));
      setCurrentView('dashboard');
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('brainloom_user');
      setCurrentView('dashboard'); // Reset view on logout
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
      if (!user) return;
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('brainloom_user', JSON.stringify(newUser));
  };

  const handleStartCourse = (course: Course) => {
    // Always find the latest version from state
    const currentCourseState = coursesList.find(c => c.id === course.id) || course;
    setSelectedCourse(currentCourseState);
    setCurrentView('course-content');
  };

  const handleStartLab = (course?: Course) => {
    if (course) {
        setSelectedCourse(course);
    }
    setCurrentView('lab-active');
  };

  const handleExitLab = (completed: boolean = false) => {
    if (completed && selectedCourse) {
      setCoursesList(prev => prev.map(c => {
        if (c.id === selectedCourse.id) {
            return { ...c, progress: 100 };
        }
        return c;
      }));
      setSelectedCourse(prev => prev ? { ...prev, progress: 100 } : null);
    }
    setCurrentView('course-content');
  };

  // --- CRUD Handlers ---

  const handleAdminSave = (updatedCourse: Course, updatedModule: CourseModule) => {
      // Update Courses List
      setCoursesList(prev => {
          const exists = prev.find(c => c.id === updatedCourse.id);
          if (exists) {
              return prev.map(c => c.id === updatedCourse.id ? updatedCourse : c);
          }
          return [...prev, updatedCourse];
      });

      // Update Modules List
      setModulesList(prev => ({
          ...prev,
          [updatedCourse.id]: updatedModule
      }));
  };

  const handleAdminDelete = (id: string) => {
      setCoursesList(prev => prev.filter(c => c.id !== id));
      const newModules = { ...modulesList };
      delete newModules[id];
      setModulesList(newModules);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} courses={coursesList} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'admin':
        if (user?.role !== 'ADMIN') return <Dashboard user={user} />;
        return (
            <AdminPanel 
                courses={coursesList}
                modules={modulesList}
                onSave={handleAdminSave}
                onDelete={handleAdminDelete}
                onClose={() => setCurrentView('dashboard')}
            />
        );
      case 'profile':
        if (!user) return <Auth onLogin={handleLogin} />;
        return (
            <Profile 
                user={user} 
                onUpdateUser={handleUpdateUser} 
                onLogout={handleLogout}
            />
        );
      case 'leaderboard':
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                         <span className="material-symbols-outlined text-primary text-2xl">leaderboard</span>
                      </div>
                      <h1 className="text-3xl font-bold text-white font-display uppercase tracking-tight">Global Rankings</h1>
                   </div>
                   <p className="text-gray-400">Compete against the world's top security researchers and climb the ranks.</p>
                </div>
                <div className="flex items-center gap-4 bg-background-card border border-white/5 rounded-xl px-4 py-2">
                   <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Operatives</div>
                      <div className="text-xl font-display font-bold text-white">{leaderboardList.length}</div>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Season Status</div>
                      <div className="text-xl font-display font-bold text-green-400">ACTIVE</div>
                   </div>
                </div>
             </div>
             <Podium users={leaderboardList.slice(0, 3)} />
             <Table user={user} entries={leaderboardList} />
          </div>
        );
      case 'arena':
        return <Arena />;
      case 'red-path':
        return (
            <TeamPath 
                team="RED" 
                courses={coursesList}
                onBack={() => setCurrentView('courses')} 
                onStartCourse={handleStartCourse}
            />
        );
      case 'blue-path':
        return (
            <TeamPath 
                team="BLUE" 
                courses={coursesList}
                onBack={() => setCurrentView('courses')} 
                onStartCourse={handleStartCourse}
            />
        );
      case 'course-content':
        if (!selectedCourse) return null;
        return (
            <CourseContent 
                course={selectedCourse} 
                modules={modulesList}
                onStartLab={handleStartLab}
                onBack={() => setCurrentView('labs')} 
            />
        );
      case 'labs':
        return (
          <LabsGrid 
            courses={coursesList}
            onStartLab={handleStartLab}
          />
        );
      case 'courses':
      default:
        return (
          <CoursePaths 
            courses={coursesList}
            onViewPath={(path) => setCurrentView(path === 'RED' ? 'red-path' : 'blue-path')} 
          />
        );
    }
  };

  // Full screen lab mode has no shell
  if (currentView === 'lab-active') {
      if (!selectedCourse) return null;
      return <LabEnvironment course={selectedCourse} modules={modulesList} onExit={handleExitLab} />;
  }

  // Main Application Layout
  return (
    <Layout 
      user={user}
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
      isDark={isDark}
      toggleTheme={toggleTheme}
      onLogout={handleLogout}
    >
        {renderContent()}
    </Layout>
  );
};

export default App;