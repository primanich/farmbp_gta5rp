import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trophy, Star, Calendar, Plus, Trash2, Clock, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

const DailyTasksApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Утренняя зарядка', 
      points: 30, 
      type: 'simple',
      completed: false 
    },
    { 
      id: 2, 
      title: 'Выпить стакан воды', 
      points: 50, 
      type: 'repeatable',
      requiredCount: 8,
      currentCount: 0,
      cooldown: 30,
      lastCompleted: null,
      timeRemaining: 0
    },
    { 
      id: 3, 
      title: 'Прочитать', 
      points: 60, 
      type: 'repeatable',
      requiredCount: 3,
      currentCount: 0,
      cooldown: 60,
      lastCompleted: null,
      timeRemaining: 0
    },
  ]);
  
  const [totalPoints, setTotalPoints] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [newTaskType, setNewTaskType] = useState('simple');
  const [newTaskCount, setNewTaskCount] = useState(3);
  const [newTaskCooldown, setNewTaskCooldown] = useState(60);
  const [showAddTask, setShowAddTask] = useState(false);

  // Таймеры для кулдаунов
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.type === 'repeatable' && task.timeRemaining > 0) {
            return { ...task, timeRemaining: Math.max(0, task.timeRemaining - 1) };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Подсчёт поинтов
  useEffect(() => {
    const completedSimple = tasks
      .filter(t => t.type === 'simple' && t.completed)
      .reduce((sum, t) => sum + t.points, 0);
    
    const completedRepeatable = tasks
      .filter(t => t.type === 'repeatable' && t.currentCount >= t.requiredCount)
      .reduce((sum, t) => sum + t.points, 0);
    
    setTodayPoints(completedSimple + completedRepeatable);
  }, [tasks]);

  const toggleSimpleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id && task.type === 'simple') {
        const newCompleted = !task.completed;
        if (newCompleted) {
          setTotalPoints(prev => prev + task.points);
        } else {
          setTotalPoints(prev => prev - task.points);
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const incrementRepeatableTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id && task.type === 'repeatable' && task.timeRemaining === 0) {
        const newCount = task.currentCount + 1;
        const wasCompleted = task.currentCount >= task.requiredCount;
        const isNowCompleted = newCount >= task.requiredCount;
        
        if (!wasCompleted && isNowCompleted) {
          setTotalPoints(prev => prev + task.points);
        }
        
        return {
          ...task,
          currentCount: newCount,
          timeRemaining: task.cooldown,
          lastCompleted: Date.now()
        };
      }
      return task;
    }));
  };

  const decrementRepeatableTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id && task.type === 'repeatable' && task.currentCount > 0) {
        const newCount = task.currentCount - 1;
        const wasCompleted = task.currentCount >= task.requiredCount;
        const isNowCompleted = newCount >= task.requiredCount;
        
        if (wasCompleted && !isNowCompleted) {
          setTotalPoints(prev => prev - task.points);
        }
        
        return { ...task, currentCount: newCount, timeRemaining: 0 };
      }
      return task;
    }));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        points: newTaskPoints,
        type: newTaskType,
      };

      if (newTaskType === 'simple') {
        newTask.completed = false;
      } else {
        newTask.requiredCount = newTaskCount;
        newTask.currentCount = 0;
        newTask.cooldown = newTaskCooldown;
        newTask.lastCompleted = null;
        newTask.timeRemaining = 0;
      }

      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskPoints(10);
      setNewTaskType('simple');
      setNewTaskCount(3);
      setNewTaskCooldown(60);
      setShowAddTask(false);
    }
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task.type === 'simple' && task.completed) {
      setTotalPoints(prev => prev - task.points);
    } else if (task.type === 'repeatable' && task.currentCount >= task.requiredCount) {
      setTotalPoints(prev => prev - task.points);
    }
    setTasks(tasks.filter(t => t.id !== id));
  };

  const saveDay = () => {
    const today = new Date().toDateString();
    const completedTasks = tasks.filter(t => 
      (t.type === 'simple' && t.completed) || 
      (t.type === 'repeatable' && t.currentCount >= t.requiredCount)
    ).map(t => t.title);

    const existingDay = history.find(h => h.date === today);
    if (existingDay) {
      setHistory(history.map(h => 
        h.date === today 
          ? { ...h, points: todayPoints, tasks: completedTasks }
          : h
      ));
    } else {
      setHistory([...history, { date: today, points: todayPoints, tasks: completedTasks }]);
    }
  };

  const resetDaily = () => {
    saveDay();
    setTasks(tasks.map(task => {
      if (task.type === 'simple') {
        return { ...task, completed: false };
      } else {
        return { ...task, currentCount: 0, timeRemaining: 0, lastCompleted: null };
      }
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Календарь
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getHistoryForDate = (date) => {
    const dateStr = date.toDateString();
    return history.find(h => h.date === dateStr);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const completedSimpleCount = tasks.filter(t => t.type === 'simple' && t.completed).length;
  const completedRepeatableCount = tasks.filter(t => t.type === 'repeatable' && t.currentCount >= t.requiredCount).length;
  const totalCompleted = completedSimpleCount + completedRepeatableCount;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">📋 Мои Задания</h1>
          <p className="text-gray-600">Выполняй задания каждый день и зарабатывай BP!</p>
        </div>

        {/* Вкладки */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Задания
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Календарь
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-700">Сегодня</h2>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-4xl font-bold text-blue-600">{todayPoints}</p>
            <p className="text-sm text-gray-500 mt-1">BP заработано</p>
            {activeTab === 'tasks' && (
              <div className="mt-3 text-sm text-gray-600">
                {totalCompleted} из {totalTasks} заданий
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Всего</h2>
              </div>
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
            <p className="text-4xl font-bold">{totalPoints}</p>
            <p className="text-sm opacity-90 mt-1">BP за всё время</p>
          </div>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'tasks' && (
          <>
            {/* Прогресс бар */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Прогресс дня</span>
                <span className="text-sm font-semibold text-indigo-600">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Список заданий */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Задания на сегодня</h2>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Добавить
                </button>
              </div>

              {/* Форма добавления */}
              {showAddTask && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Название задания..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-indigo-500 focus:outline-none"
                  />
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">BP:</label>
                      <input
                        type="number"
                        value={newTaskPoints}
                        onChange={(e) => setNewTaskPoints(parseInt(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Тип:</label>
                      <select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value)}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="simple">Простое</option>
                        <option value="repeatable">Повторяющееся</option>
                      </select>
                    </div>
                  </div>

                  {newTaskType === 'repeatable' && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Количество раз:</label>
                        <input
                          type="number"
                          value={newTaskCount}
                          onChange={(e) => setNewTaskCount(parseInt(e.target.value) || 1)}
                          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Кулдаун (сек):</label>
                        <input
                          type="number"
                          value={newTaskCooldown}
                          onChange={(e) => setNewTaskCooldown(parseInt(e.target.value) || 0)}
                          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          min="0"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={addTask}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Создать задание
                    </button>
                    <button
                      onClick={() => setShowAddTask(false)}
                      className="px-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Задания */}
              <div className="space-y-3">
                {tasks.map(task => {
                  if (task.type === 'simple') {
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          task.completed 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleSimpleTask(task.id)}
                            className="focus:outline-none"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                              <Circle className="w-8 h-8 text-gray-400 hover:text-indigo-600" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold px-3 py-1 rounded-full ${
                              task.completed 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-indigo-200 text-indigo-800'
                            }`}>
                              +{task.points}
                            </span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const isCompleted = task.currentCount >= task.requiredCount;
                    const canIncrement = task.timeRemaining === 0;
                    
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <Repeat className={`w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-indigo-600'}`} />
                            <div className="flex-1">
                              <p className={`font-semibold ${isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {task.currentCount} / {task.requiredCount} раз
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold px-3 py-1 rounded-full ${
                              isCompleted
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-indigo-200 text-indigo-800'
                            }`}>
                              +{task.points}
                            </span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementRepeatableTask(task.id)}
                            disabled={task.currentCount === 0}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold"
                          >
                            −
                          </button>
                          
                          <button
                            onClick={() => incrementRepeatableTask(task.id)}
                            disabled={!canIncrement}
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            {task.timeRemaining > 0 ? (
                              <>
                                <Clock className="w-5 h-5" />
                                {formatTime(task.timeRemaining)}
                              </>
                            ) : (
                              'Выполнить'
                            )}
                          </button>
                          
                          <button
                            onClick={() => incrementRepeatableTask(task.id)}
                            disabled={!canIncrement}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {/* Кнопка сброса */}
            <div className="text-center">
              <button
                onClick={resetDaily}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Сбросить задания на новый день
              </button>
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Навигация по месяцам */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Календарь */}
            <div className="grid grid-cols-7 gap-2">
              {/* Дни недели */}
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Дни месяца */}
              {(() => {
                const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                const days = [];
                
                // Пустые ячейки до начала месяца
                for (let i = 0; i < startingDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} className="p-2" />);
                }
                
                // Дни месяца
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const dayHistory = getHistoryForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  days.push(
                    <div
                      key={day}
                      className={`p-2 rounded-lg border-2 transition-all min-h-20 ${
                        isToday
                          ? 'border-indigo-500 bg-indigo-50'
                          : dayHistory
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-gray-800 text-center mb-1">{day}</div>
                      {dayHistory && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{dayHistory.points} BP</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {dayHistory.tasks.length} {dayHistory.tasks.length === 1 ? 'задание' : 'заданий'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>

            {/* Легенда */}
            <div className="mt-6 flex gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-indigo-500 bg-indigo-50" />
                <span className="text-sm text-gray-600">Сегодня</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-green-300 bg-green-50" />
                <span className="text-sm text-gray-600">Выполнены задания</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-gray-200 bg-white" />
                <span className="text-sm text-gray-600">Нет данных</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTasksApp;