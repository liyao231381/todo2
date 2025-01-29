    // src/app/page.js
    "use client";

    import { useEffect, useState } from 'react';
    import axios from 'axios';
    import Link from 'next/link';
    import TodoModal from './components/TodoModal';
    import DeleteConfirmationModal from './components/DeleteConfirmationModal';
    import Button from '@mui/material/Button';
    import Typography from '@mui/material/Typography';
    import Box from '@mui/material/Box';
    import { styled } from '@mui/material/styles';
    import BarChartIcon from '@mui/icons-material/BarChart';
    import AddIcon from '@mui/icons-material/Add';
    import VisibilityIcon from '@mui/icons-material/Visibility';
    import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
    import { useMediaQuery } from '@mui/material';
    import TodoList from './components/TodoList';
    import SearchBox from './components/SearchBox';
    import SortOptions from './components/SortOptions';
    import TagFilter from './components/TagFilter';
    import IconButton from '@mui/material/IconButton';
    import SearchIcon from '@mui/icons-material/Search';
    import Modal from 'react-modal';
    import { v4 as uuidv4 } from 'uuid';
    import Calendar from './components/Calendar';
    import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
    import CircularProgress from '@mui/material/CircularProgress'; // 引入 CircularProgress
     import { useRouter } from 'next/navigation';

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        padding: theme.spacing(0.3),
        marginRight: theme.spacing(1),
        color: '#00aaff',
        '& svg': {
            fontSize: '1.7rem',
        },
    }));

    const StyledAddIconButton = styled(IconButton)(({ theme }) => ({
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
        '& svg': {
            fontSize: '2.5rem',
        },
    }));

    const StyledButton = styled(Button)(({ theme }) => ({
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Sans-serif',
        marginRight: theme.spacing(0),
        padding: theme.spacing(1, 2),
        '& .MuiButton-startIcon': {
            marginRight: theme.spacing(0.5),
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5, 1),
            minWidth: 'auto',
        },
    }));

    export default function Home() {
        const [todos, setTodos] = useState([]);
        const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
        const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
        const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
        const [todoToDelete, setTodoToDelete] = useState(null);
        const [editingTodo, setEditingTodo] = useState(null);
        const [currentTagFilter, setCurrentTagFilter] = useState(null);
        const [sortOption, setSortOption] = useState({ sortBy: 'id', sortOrder: 'desc' });
        const [showCompleted, setShowCompleted] = useState(false);
        const [searchKeyword, setSearchKeyword] = useState('');
        const [searchKeywordInput, setSearchKeywordInput] = useState('');
        const [showSearchBox, setShowSearchBox] = useState(false);
        const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
        const [selectedDate, setSelectedDate] = useState(null);
        const [isLoading, setIsLoading] = useState(false); // 添加 isLoading 状态
        const isMobile = useMediaQuery('(max-width:600px)');
         const router = useRouter();
        useEffect(() => {
            if (typeof window !== 'undefined') {
                Modal.setAppElement(document.body);
            }
           const token = localStorage.getItem('token');
              if(!token) {
              router.push('/auth');
              }
        }, []);

        useEffect(() => {
            const fetchTodos = async () => {
                setIsLoading(true);
                try {
                    let url = '/api/todos';
                    const queryParams = [];
                    const token = localStorage.getItem('token');

                     if(!token) {
                       router.push('/auth');
                        return;
                      }
                    const headers = {
                       Authorization: `Bearer ${token}`,
                     };


                    if (currentTagFilter) {
                        queryParams.push(`tag=${currentTagFilter}`);
                    }
                    if (sortOption.sortBy) {
                        queryParams.push(`sortBy=${sortOption.sortBy}&sortOrder=${sortOption.sortOrder}`);
                    }
                    if (!showCompleted) {
                        queryParams.push(`completed=false`);
                    }
                    if (searchKeyword) {
                        queryParams.push(`search=${searchKeyword}`);
                    }
                    if (selectedDate) {
                        const formattedDate = selectedDate.toISOString().split('T')[0];
                        queryParams.push(`dueDate=${formattedDate}`);
                    }
                    if (queryParams.length > 0) {
                        url += `?${queryParams.join('&')}`;
                    }

                    const response = await fetch(url, {
                        signal: AbortSignal.timeout(10000),
                        cache: 'no-cache',
                        headers: headers,
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.error) {
                            console.error('获取待办事项失败:', data.error);
                        } else {
                            setTodos(data);
                        }
                    } else {
                        console.error('获取待办事项失败:', response.status, response.statusText);
                        const cachedTodos = await caches.match(url);
                        if (cachedTodos) {
                            const data = await cachedTodos.json();
                            if (data && data.length > 0) {
                                setTodos(data);
                                console.log('从缓存加载待办事项');
                            }
                        } else {
                            console.error('没有缓存数据, 无法展示');
                        }
                    }
                } catch (error) {
                    console.error('获取待办事项失败:', error);
                    const cachedTodos = await caches.match(url);
                    if (cachedTodos) {
                        const data = await cachedTodos.json();
                        if (data && data.length > 0) {
                            setTodos(data);
                            console.log('从缓存加载待办事项');
                        }
                    } else {
                        console.error('没有缓存数据, 无法展示');
                    }
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTodos();
        }, [currentTagFilter, sortOption, showCompleted, searchKeyword, selectedDate, router]);

        const handleSearchInputChange = (e) => {
            setSearchKeywordInput(e.target.value);
        };

        const handleSearch = () => {
            setSearchKeyword(searchKeywordInput);
        };

        const openAddTodoModal = () => {
            setIsAddTodoModalOpen(true);
        };

        const closeAddTodoModal = () => {
            setIsAddTodoModalOpen(false);
        };

        const handleAddTodo = async (newTodo) => {
          const token = localStorage.getItem('token');
             if(!token) {
                router.push('/auth');
                   return;
               }
          const headers = {
              Authorization: `Bearer ${token}`,
             };
           if (navigator.onLine) {
               try {
                 const response = await axios.post('/api/todos', newTodo, { headers: headers });
                  setTodos([response.data, ...todos]);
                   closeAddTodoModal();
               } catch (error) {
                  console.error('Error adding todo:', error);
                }
           } else {
                await syncData('POST', newTodo);
               setTodos([newTodo, ...todos]);
                closeAddTodoModal();
            }
        };

        const openDeleteConfirmationModal = (todoId) => {
            setTodoToDelete(todoId);
            setIsDeleteConfirmationModalOpen(true);
        };

        const closeDeleteConfirmationModal = () => {
            setTodoToDelete(null);
            setIsDeleteConfirmationModalOpen(false);
        };

        const handleDeleteTodo = async () => {
             const token = localStorage.getItem('token');
              if(!token) {
               router.push('/auth');
                return;
              }
           const headers = {
               Authorization: `Bearer ${token}`,
              };
           if (navigator.onLine) {
               try {
                   await axios.delete('/api/todos', { data: { id: todoToDelete }, headers: headers });
                    setTodos(todos.filter((todo) => todo.id !== todoToDelete));
                   closeDeleteConfirmationModal();
                } catch (error) {
                   console.error('Error deleting todo:', error);
                }
           } else {
              await syncData('DELETE', { id: todoToDelete });
              setTodos(todos.filter((todo) => todo.id !== todoToDelete));
               closeDeleteConfirmationModal();
           }
       };


        const handleUpdateTodo = async (updatedTodo) => {
             const token = localStorage.getItem('token');
              if(!token) {
                  router.push('/auth');
                  return;
                }

           const headers = {
               Authorization: `Bearer ${token}`,
                };
           if (navigator.onLine) {
               try {
                    const response = await axios.put(`/api/todos`, updatedTodo, {headers: headers});
                    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? response.data : todo)));
                    closeEditTodoModal();
                } catch (error) {
                    console.error('Error updating todo:', error);
                }
            } else {
                await syncData('PUT', updatedTodo);
                setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
                closeEditTodoModal();
            }
        };

        const handleCompleteToggle = async (id, completed) => {
             const token = localStorage.getItem('token');
                if(!token) {
                   router.push('/auth');
                   return;
              }

            const headers = {
               Authorization: `Bearer ${token}`,
              };
            if (navigator.onLine) {
                try {
                    const response = await axios.patch(`/api/todos/${id}/complete`, { completed }, { headers: headers });
                     if (!showCompleted) {
                        setTodos(todos.filter(todo => todo.id !== id));
                    } else {
                       setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: response.data.completed } : todo)));
                   }
                } catch (error) {
                    console.error('Error updating todo:', error);
               }
            } else {
                await syncData('PATCH', { id, completed });
                 if (!showCompleted) {
                     setTodos(todos.filter(todo => todo.id !== id));
                 } else {
                    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: completed } : todo)));
                }
           }
        };

        const startEditing = (todo) => {
            setEditingTodo(todo);
            setIsEditTodoModalOpen(true);
        };

        const closeEditTodoModal = () => {
            setIsEditTodoModalOpen(false);
            setEditingTodo(null);
        };

        const handleTagFilter = (tag) => {
            setCurrentTagFilter(tag);
        };

        const clearTagFilter = () => {
            setCurrentTagFilter(null);
        };

        const handleSortChange = (value) => {
            const [sortBy, sortOrder] = value.split(',');
            setSortOption({ sortBy, sortOrder });
        };

        const handleShowCompletedChange = () => {
            setShowCompleted((prevShowCompleted) => !prevShowCompleted);
        };

        const getUniqueTags = () => {
            const allTags = todos.flatMap((todo) => (todo.tags ? todo.tags.split(',').map((tag) => tag.trim()) : []));
            return [...new Set(allTags)];
        };

        const toggleSearchBox = () => {
            setShowSearchBox(!showSearchBox);
        };

        const openCalendarModal = () => {
            setIsCalendarModalOpen(true);
        };

        const closeCalendarModal = () => {
            setIsCalendarModalOpen(false);
        };

        const handleDateSelect = (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1); // 将日期加 1 天
            setSelectedDate(nextDay);
            closeCalendarModal();
        };

        const clearDateFilter = () => {
            setSelectedDate(null);
        };
          const handleLogout = () => {
            localStorage.removeItem('token');
            router.push('/auth');
           };

        return (
            <Box
                sx={{
                    maxWidth: '800px',
                    width: 'calc(100% - 32px)',
                    bgcolor: 'background.default',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '30px auto',
                    border: 'none',
                    borderRadius: '12px',
                }}
            >
                <Box
                   sx={{
                      color: 'black',
                       margin: '8px 15px 0 18px',
                      display: 'flex',
                       alignItems: 'center',
                      justifyContent: 'space-between',
                 }}
                >
                   <Box sx={{display: 'flex',  alignItems: 'center',justifyContent: 'flex-start'}}>
                    <StyledIconButton onClick={handleLogout} sx={{mr: 0}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00aaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)'}}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                           <line x1="21" y1="12" x2="9" y2="12"></line>
                         </svg>
                       </StyledIconButton>
                   </Box>
                   <Box>
                    <Typography variant="h6" fontFamily="Sans-serif" fontWeight="bold" fontSize="2rem" sx={{ flexGrow: 1, textAlign: 'center'}}>
                        待办事项
                    </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <StyledIconButton onClick={toggleSearchBox}>
                            <SearchIcon />
                        </StyledIconButton>
                        <Link href="/stats" passHref>
                            <StyledIconButton component="div">
                                <BarChartIcon />
                            </StyledIconButton>
                        </Link>
                        <StyledIconButton onClick={openCalendarModal}>
                            <CalendarMonthIcon />
                        </StyledIconButton>
                        <StyledIconButton onClick={handleShowCompletedChange}>
                            {showCompleted ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </StyledIconButton>
                    </Box>
                </Box>

                <Box sx={{
                    maxHeight: showSearchBox ? '100px' : '0',
                    transition: 'max-height 0.3s ease-in-out',
                    overflow: 'hidden',
                    px: isMobile ? 0 : 4,
                }}>
                    {showSearchBox && (
                        <SearchBox value={searchKeywordInput} onChange={handleSearchInputChange} onSearch={handleSearch} />
                    )}
                </Box>

                <Box px={isMobile ? 2 : 3} mb={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <TagFilter
                            tags={getUniqueTags()}
                            currentTagFilter={currentTagFilter}
                            onTagFilter={handleTagFilter}
                            onClearTagFilter={clearTagFilter}
                        />
                    </Box>
                    {selectedDate && (
                        <Button
                            onClick={clearDateFilter}
                            sx={{
                                ml: 2,
                                backgroundColor: 'white',
                                color: '#00aaff',
                                '&:hover': {
                                    backgroundColor: 'rgb(232, 232, 232)',
                                },
                                width: 'fit-content',
                                marginRight: '4px',
                            }}
                        >
                            清除日期选择
                        </Button>
                    )}
                    <SortOptions
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />
                    <StyledButton
                        onClick={openAddTodoModal}
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon style={{ color: 'white' }} />}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            backgroundColor: '#00aaff',
                            marginLeft: '4px',
                            height: '32px',
                            width: 'fit-content',
                        }}
                    >
                        添加
                    </StyledButton>
                </Box>

                <Modal
                    isOpen={isCalendarModalOpen}
                    onRequestClose={closeCalendarModal}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        },
                        content: {
                            width: '80%',
                            maxWidth: '800px',
                            height: 'fit-content',
                            margin: 'auto',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '20px',
                        }
                    }}
                >
                    <Calendar todos={todos} onDateSelect={handleDateSelect} />
                </Modal>

                {/* 待办事项列表 */}
                <Box
                    sx={{
                        overflowY: 'auto',
                        flexGrow: 1,
                        px: isMobile ? 1 : 2,
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        position: 'relative',
                    }}
                >
                    {/* Loading 指示器 */}
                    {isLoading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                zIndex: 10,
                            }}
                        >
                            <CircularProgress
                                size={60}
                                thickness={2}
                                sx={{
                                    color: '#00aaff',
                                }}
                            />
                        </Box>
                    )}
                    {!isLoading && (
                        <TodoList
                            todos={showCompleted ? todos : todos.filter(todo => !todo.completed)}
                            onEdit={startEditing}
                            onDelete={openDeleteConfirmationModal}
                            onToggleComplete={handleCompleteToggle}
                            onReorder={setTodos}
                        />
                    )}
                </Box>
        
                {/* 添加待办事项模态框 */}
                <TodoModal
                    isOpen={isAddTodoModalOpen}
                    onRequestClose={closeAddTodoModal}
                    onAddTodo={handleAddTodo}
                    onUpdateTodo={handleUpdateTodo}
                    isEditMode={false}
                />

                {/* 编辑待办事项模态框 */}
                <TodoModal
                    isOpen={isEditTodoModalOpen}
                    onRequestClose={closeEditTodoModal}
                    onUpdateTodo={handleUpdateTodo}
                    todo={editingTodo}
                    isEditMode={true}
                />

                {/* 删除待办事项模态框 */}
                <DeleteConfirmationModal
                    isOpen={isDeleteConfirmationModalOpen}
                    onRequestClose={closeDeleteConfirmationModal}
                    onConfirm={handleDeleteTodo}
                />

                <StyledAddIconButton onClick={openAddTodoModal} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <AddIcon />
                </StyledAddIconButton>
            </Box>
        );
    }
