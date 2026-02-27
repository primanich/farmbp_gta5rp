
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadProgress } from "./progress";
import { saveProgress } from "./progress";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Trophy,
  Star,
  Calendar,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Task, HistoryEntry } from "./types";


function App() {
  
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<Task[]>([
  {
    id: 1,
    title: "Сходить в спортзал",
    points: 10,
    type: "simple",
    completed: false,
  },
  {
    id: 2,
    title: "Выпить воду 3 раза",
    points: 15,
    type: "repeatable",
    requiredCount: 3,
    currentCount: 0,
    cooldown: 60,
    lastCompleted: null,
    timeRemaining: 0,
  },
]);

  const [showSettings, setShowSettings] = useState(false);

const [defaultTasks, setDefaultTasks] = useState([

  // { id: "", title: "", type: "simple", points: 2, enabled: true },
  // { id: "", title: "", type: "repeatable", points: 4, requiredCount: , cooldown: , enabled: true },
  { id: "online", title: "3 часа в онлайне (можно выполнять многократно за день, когда вам начисляются BP в игре просто нажмите на +)", type: "simple", points: 2, enabled: true },
  { id: "casino", title: "Нули в казино", type: "simple", points: 2, enabled: true },
  { id: "stroyka", title: "25 действий на стройке", type: "simple", points: 2, enabled: true },
  { id: "port", title: "25 действий в порту", type: "simple", points: 2, enabled: true },
  { id: "shahta", title: "25 действий в шахте", type: "simple", points: 2, enabled: true },
  { id: "dance", title: "3 победы в Дэнс Баттлах", type: "simple", points: 2, enabled: true },
  { id: "bizak", title: "Заказ материалов для бизнеса вручную (просто прожать вкл/выкл", type: "simple", points: 1, enabled: true },
  { id: "fitness", title: "20 подходов в тренажерном зале", type: "simple", points: 1, enabled: true },
  { id: "tir", title: "Успешная тренировка в тире", type: "simple", points: 1, enabled: true },
  { id: "studio", title: "Арендовать киностудию", type: "simple", points: 2, enabled: true },
  { id: "post", title: "10 посылок на почте", type: "repeatable", points: 1, requiredCount: 10, cooldown: 3600, enabled: true },
  { id: "ticket", title: "Купить лотерейный билет", type: "simple", points: 1, enabled: true },
  { id: "carting", title: "Выиграть гонку в картинге", type: "simple", points: 1, enabled: true },
  { id: "ferma", title: "10 действий на ферме (10 коров, 10 пшеницы и т.д. - один любой способ в день)", type: "simple", points: 1, enabled: true },
  { id: "fire", title: "Потушить 25 'огоньков' пожарным", type: "simple", points: 1, enabled: true },
  { id: "gold", title: "Выкопать 1 сокровище(не мусор)", type: "simple", points: 1, enabled: true },
  { id: "racing", title: "Проехать 1 уличную гонку (через регистрацию в телефоне, ставка минимум 1000$)", type: "simple", points: 1, enabled: true },
  { id: "truck", title: "Выполнить 3 заказа дальнобойщиком", type: "simple", points: 2, enabled: true },
  { id: "doctor", title: "2 раза оплатить смену внешности у хирурга в EMS", type: "simple", points: 2, enabled: true },
  { id: "theater", title: "Добавить 5 видео в кинотеатре", type: "simple", points: 1, enabled: true },
  { id: "aim", title: "Выиграть 5 игр в тренировочном комплексе со ставкой (от 100$)", type: "simple", points: 1, enabled: true },
  { id: "arena", title: "Выиграть 3 любых игры на арене со ставкой (от 100$)", type: "simple", points: 1, enabled: true },
  { id: "bus", title: "2 круга на любом маршруте автобусника", type: "simple", points: 2, enabled: true },
  { id: "hunter", title: "5 раз снять 100% шкуру с животных", type: "simple", points: 2, enabled: true },
  { id: "graffity", title: "7 закрашенных граффити ", type: "simple", points: 1, enabled: true },
  { id: "narco", title: "Сдать 5 контрабанды", type: "repeatable", points: 2, requiredCount: 5, cooldown: 180, enabled: true },
  { id: "kapt", title: "Участие в каптах/бизварах", type: "simple", points: 1, enabled: true },
  { id: "vzh", title: "Сдать Хаммер с ВЗХ", type: "simple", points: 3, enabled: true },
  { id: "medcard", title: "5 выданных медкарт в EMS", type: "simple", points: 2, enabled: true },
  { id: "medik", title: "Закрыть 15 вызовов в EMS", type: "simple", points: 2, enabled: true },
  { id: "wn", title: "Отредактировать 40 объявлений в WN", type: "simple", points: 2, enabled: true },
  { id: "gang", title: "Взломать 15 замков на ограблениях домов или автоугонах", type: "repeatable", points: 2, requiredCount: 15, cooldown: 300, enabled: true },
  { id: "police", title: "Закрыть 5 кодов в силовых структурах", type: "simple", points: 2, enabled: true },
  { id: "police2", title: "Поставить на учет 2 автомобиля (для LSPD)", type: "repeatable", points: 1, requiredCount: 2, cooldown: 10, enabled: true },
  { id: "police3", title: "Произвести 1 арест в КПЗ", type: "simple", points: 1, enabled: true },
  { id: "police4", title: "Выкупить двух человек из КПЗ", type: "repeatable", points: 2, requiredCount: 2, cooldown: 60, enabled: true },
  { id: "web", title: "Посетить любой сайт в браузере", type: "simple", points: 1, enabled: true },
  { id: "brawl", title: "Зайти в любой канал в Brawl", type: "simple", points: 1, enabled: true },
  { id: "like", title: "Поставить лайк любой анкете в Match", type: "simple", points: 1, enabled: true },
  { id: "case", title: "Прокрутить за DP серебрянный, золотой или driver кейс", type: "simple", points: 10, enabled: true },
  { id: "pet", title: "Кинуть мяч питомцу 15 раз", type: "simple", points: 2, enabled: true },
  { id: "pet2", title: "15 выполненных питомцем команд", type: "simple", points: 2, enabled: true },
  { id: "casino2", title: "Ставка в колесе удачи в казино (межсерверное колесо)", type: "simple", points: 3, enabled: true },
  { id: "metro", title: "Проехать 1 станцию на метро", type: "simple", points: 2, enabled: true },
  { id: "fishing", title: "Поймать 20 рыб", type: "repeatable", points: 4, requiredCount: 20, cooldown: 0, enabled: true },
  { id: "club", title: "Выполнить 2 квеста любых клубов", type: "repeatable", points: 4, requiredCount: 2, cooldown: 10, enabled: true },
  { id: "service", title: "Починить деталь в автосервисе", type: "simple", points: 1, enabled: true },
  { id: "basket", title: "Забросить 2 мяча в баскетболе", type: "simple", points: 1, enabled: true },
  { id: "football", title: "Забить 2 гола в футболе", type: "simple", points: 1, enabled: true },
  { id: "fitness2", title: "Победить в армрестлинге", type: "simple", points: 1, enabled: true },
  { id: "club2", title: "Победить в дартс", type: "simple", points: 1, enabled: true },
  { id: "valeyball", title: "Поиграть 1 минуту в волейбол", type: "simple", points: 1, enabled: true },
  { id: "tennis", title: "Поиграть 1 минуту в настольный теннис", type: "simple", points: 1, enabled: true },
  { id: "tennis2", title: "Поиграть 1 минуту в большой теннис", type: "simple", points: 1, enabled: true },
  { id: "casino", title: "Сыграть в мафию в казино", type: "simple", points: 3, enabled: true },
  { id: "leasing", title: "Сделать платеж по лизингу", type: "simple", points: 1, enabled: true },
  { id: "mar", title: "Посадить траву в теплице", type: "simple", points: 4, enabled: true },
  { id: "lab", title: "Запустить переработку обезболивающих в лаборатории", type: "simple", points: 4, enabled: true },
  { id: "drop", title: "Принять участие в двух аирдропах", type: "repeatable", points: 4, requiredCount: 2, cooldown: 15, enabled: true },
]);

  const [selectAllDefaults, setSelectAllDefaults] = useState(true);

  const toggleSelectAllDefaults = (checked: boolean) => {
  setSelectAllDefaults(checked);
  setDefaultTasks(prev => prev.map(t => ({ ...t, enabled: checked })));
  };

  const [isVipUser, setIsVipUser] = useState(false); // VIP выключен по умолчанию
  const [globalMultiplier, setGlobalMultiplier] = useState(false); // ×2 выключен по умолчанию


  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);

  // форма добавления
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [newTaskType, setNewTaskType] = useState<"simple" | "repeatable" | "procore">("simple");
  const [newTaskCount, setNewTaskCount] = useState(3);
  const [newTaskCooldown, setNewTaskCooldown] = useState(60);
  const [showAddTask, setShowAddTask] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());


  // Загружаем задачи из localStorage при старте
useEffect(() => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    setTasks(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  if (auth.currentUser) {
    saveProgress(auth.currentUser.uid, tasks, totalPoints, todayPoints);
  }
}, [tasks, totalPoints, todayPoints]);


useEffect(() => {
  // Запускаем анонимный вход
  signInAnonymously(auth).catch((error) => {
    console.error("Ошибка анонимного входа:", error);
  });

  // Следим за состоянием пользователя
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Анонимный пользователь:", user.uid);

      // Загружаем прогресс из Firestore
      const data = await loadProgress(user.uid);
      if (data) {
        setTasks(data.tasks);
        setTotalPoints(data.totalPoints);
        setTodayPoints(data.todayPoints);
      }
    }
  });

  return () => unsubscribe();
}, []);


useEffect(() => {
  if (auth.currentUser) {
    saveProgress(auth.currentUser.uid, tasks, totalPoints, todayPoints)
      .catch(err => console.error("Ошибка сохранения:", err));
  }
}, [tasks, totalPoints, todayPoints]);

useEffect(() => {
  const savedDefaults = localStorage.getItem("defaultTasks");
  if (savedDefaults) {
    setDefaultTasks(JSON.parse(savedDefaults));
  }
}, []);

useEffect(() => {
  localStorage.setItem("defaultTasks", JSON.stringify(defaultTasks));
}, [defaultTasks]);

useEffect(() => {
  const allEnabled = defaultTasks.every(t => t.enabled);
  setSelectAllDefaults(allEnabled);
}, [defaultTasks]);

// Сохраняем задачи в localStorage при каждом изменении
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

useEffect(() => {
  const savedVip = localStorage.getItem("isVipUser");
  if (savedVip) setIsVipUser(JSON.parse(savedVip));

  const savedMultiplier = localStorage.getItem("globalMultiplier");
  if (savedMultiplier) setGlobalMultiplier(JSON.parse(savedMultiplier));
}, []);

useEffect(() => {
  localStorage.setItem("isVipUser", JSON.stringify(isVipUser));
}, [isVipUser]);

useEffect(() => {
  localStorage.setItem("globalMultiplier", JSON.stringify(globalMultiplier));
}, [globalMultiplier]);

const getMultiplier = (): number => {
  let multiplier = 1;
  if (globalMultiplier) multiplier *= 2;
  if (isVipUser) multiplier *= 2;
  return multiplier;
};

const getMultiplierLabel = (): string => {
  if (isVipUser && globalMultiplier) return "VIP + ×2 активен";
  if (isVipUser) return "VIP активен";
  if (globalMultiplier) return "×2 активен";
  return "";
};

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



const toggleSimpleTask = (id: number) => {
  setTasks(prevTasks =>
    prevTasks.map(task => {
      if (task.id === id && task.type === "simple") {
        const newCompleted = !task.completed;

        if (newCompleted) {
          const earned = task.points * getMultiplier();
          setTodayPoints(prev => prev + earned);
          setTotalPoints(prev => prev + earned);
          return { ...task, completed: true, earnedPoints: earned };
        } else {
          setTodayPoints(prev => prev - (task.earnedPoints ?? task.points));
          setTotalPoints(prev => prev - (task.earnedPoints ?? task.points));
          return { ...task, completed: false, earnedPoints: 0 };
        }
      }
      return task;
    })
  );
};


const incrementRepeatableTask = (id: number) => {
  setTasks((prevTasks: Task[]) =>
    prevTasks.map((task: Task) => {
      if (task.id === id && task.type === "repeatable" && task.timeRemaining === 0) {
        const newCount = task.currentCount + 1;
        const wasCompleted = task.currentCount >= task.requiredCount;
        const isNowCompleted = newCount >= task.requiredCount;

       if (!wasCompleted && isNowCompleted) {
  const earned = task.points * getMultiplier();
  setTodayPoints(prev => prev + earned);
  setTotalPoints(prev => prev + earned);
  return {
    ...task,
    currentCount: newCount,
    timeRemaining: task.cooldown,
    lastCompleted: Date.now(),
    earnedPoints: earned
  };
}

      }
      return task;
    })
  );
};

  const decrementRepeatableTask = (id: number) => {
  setTasks((prevTasks: Task[]) =>
    prevTasks.map((task: Task) => {
      if (task.id === id && task.type === "repeatable" && task.currentCount > 0) {
        const newCount = task.currentCount - 1;
        const wasCompleted = task.currentCount >= task.requiredCount;
        const isNowCompleted = newCount >= task.requiredCount;

       if (wasCompleted && !isNowCompleted) {
  setTodayPoints(prev => prev - (task.earnedPoints ?? task.points));
  setTotalPoints(prev => prev - (task.earnedPoints ?? task.points));
  return { ...task, currentCount: newCount, timeRemaining: 0, earnedPoints: 0 };
}

      }
      return task;
    })
  );
};

  const addTask = () => {
  if (newTaskTitle.trim()) {
    let newTask: Task;

    if (newTaskType === "simple") {
      newTask = {
        id: Date.now(),
        title: newTaskTitle,
        points: newTaskPoints,
        type: "simple",
        completed: false,
      };
    } else {
      newTask = {
        id: Date.now(),
        title: newTaskTitle,
        points: newTaskPoints,
        type: "repeatable",
        requiredCount: newTaskCount,
        currentCount: 0,
        cooldown: newTaskCooldown,
        lastCompleted: null,
        timeRemaining: 0,
      };
    }

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskPoints(10);
    setNewTaskType("simple");
    setNewTaskCount(3);
    setNewTaskCooldown(60);
    setShowAddTask(false);
  }
};

  const deleteTask = (id: number) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.type === "simple" && task.completed) {
    setTotalPoints(prev => prev - task.points);
  } else if (task.type === "repeatable" && task.currentCount >= task.requiredCount) {
    setTotalPoints(prev => prev - task.points);
  }

  setTasks(prev => prev.filter(t => t.id !== id));
};
  const saveDay = () => {
  const today = new Date().toDateString();
  const completedTasks = tasks
    .filter(t =>
      (t.type === "simple" && t.completed) ||
      (t.type === "repeatable" && t.currentCount >= t.requiredCount)
    )
    .map(t => t.title);

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
  setTasks((prevTasks: Task[]) =>
    prevTasks.map((task: Task) => {
      if (task.type === "simple") {
        return { ...task, completed: false };
      } else {
        return {
          ...task,
          currentCount: 0,
          timeRemaining: 0,
          lastCompleted: null,
        };
      }
    })
  );
};

 // форматирование секунд в mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};


// Календарь
const getDaysInMonth = (date: Date) => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth();
  const firstDay: Date = new Date(year, month, 1);
  const lastDay: Date = new Date(year, month + 1, 0);
  const daysInMonth: number = lastDay.getDate();
  const startingDayOfWeek: number = firstDay.getDay();

  return { daysInMonth, startingDayOfWeek, year, month };
};

const getHistoryForDate = (date: Date) => {
  const dateStr: string = date.toDateString();
  return history.find((h) => h.date === dateStr);
};

const changeMonth = (direction: number) => {
  const newDate: Date = new Date(currentMonth);
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
          <div className="flex justify-between items-center text-gray-600 text-sm sm:text-base">
  <span>Табличка для фарма BP!</span>
  <span className="italic text-indigo-500 font-semibold">by PRIMAN</span>
</div>
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

  {/* Отдельная маленькая кнопка справа */}
  <button
    onClick={() => setShowSettings(true)}
    className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-semibold ml-auto"
  >
    ⚙️
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
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
  <div className="flex items-center justify-between mb-2">
  {/* Левая часть — текст и процент */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-gray-700">Прогресс дня</span>
    <span className="text-sm font-semibold text-indigo-600">{Math.round(progressPercent)}%</span>
  </div>

  {/* Правая часть — тогл‑кнопки */}
  <div className="flex gap-2">
    <button
      onClick={() => setIsVipUser(!isVipUser)}
      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
        isVipUser ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      VIP {isVipUser ? "✓" : ""}
    </button>

    <button
      onClick={() => setGlobalMultiplier(!globalMultiplier)}
      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
        globalMultiplier ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      ×2 {globalMultiplier ? "✓" : ""}
    </button>
  </div>
</div>
  </div>

  {/* Прогресс‑бар */}
  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
      style={{ width: `${progressPercent}%` }}
    />
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
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                         setNewTaskType(e.target.value as "simple" | "repeatable")
                           }
                            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                             >
                        <option value="simple">Обычное</option>
                         <option value="repeatable">Повторяемое</option>
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
                {tasks.map((task) => {
  if (task.type === "simple") {
    return (
      <div
        key={task.id}
        className={`p-4 mb-3 rounded-lg border-2 shadow-sm bg-white flex items-center justify-between transition-all ${
          task.completed
            ? "bg-green-50 border-green-300"
            : "hover:border-indigo-300"
        }`}
      >
        {/* Левая часть: чек + название */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => toggleSimpleTask(task.id)}
            className="focus:outline-none"
            aria-label={task.completed ? "Отменить выполнение" : "Отметить выполненным"}
          >
            {task.completed ? (
              <CheckCircle className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10l-4.5 4.5L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </CheckCircle>
            ) : (
              <Circle className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </Circle>
            )}
          </button>

          <p className={`font-semibold ${task.completed ? "text-gray-500 line-through" : "text-gray-800"}`}>
            {task.title}
          </p>
        </div>

        {/* Правая часть: очки + удалить */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start">
  <div className="flex flex-col items-start">
  <span className="px-3 py-1 rounded-full bg-indigo-200 text-indigo-800 font-bold">
    +{task.points * getMultiplier()}
  </span>
  {getMultiplierLabel() && (
    <span className="text-xs text-green-600 font-semibold mt-1">
      {getMultiplierLabel()}
    </span>
  )}
</div>
</div>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Удалить задание"
          >
            <Trash2 className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2"/>
            </Trash2>
          </button>
        </div>
      </div>
    );
  }

  if (task.type === "repeatable") {
    const canIncrement =
      (task.currentCount ?? 0) < (task.requiredCount ?? 0) &&
      (task.timeRemaining ?? 0) === 0;

    return (
      <div
        key={task.id}
        className="p-4 mb-3 rounded-lg border-2 shadow-sm bg-white flex items-center justify-between transition-all hover:border-indigo-300"
      >
        {/* Левая часть: название и счетчик */}
        <div className="flex items-center gap-3 flex-1">
          <div>
            <p className="font-semibold text-gray-800">{task.title}</p>
            <p className="text-sm text-gray-500">
              {(task.currentCount ?? 0)} / {(task.requiredCount ?? 0)} раз
            </p>
          </div>
        </div>

        {/* Правая часть: кнопки и очки */}
        <div className="flex items-center gap-3">
          {/* Минус */}
          <button
            onClick={() => decrementRepeatableTask(task.id)}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Уменьшить прогресс"
          >
            −
          </button>

          {/* Выполнить / таймер кулдауна */}
          <button
            onClick={() => incrementRepeatableTask(task.id)}
            disabled={!canIncrement}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            aria-label="Выполнить"
          >
            {task.timeRemaining && task.timeRemaining > 0
              ? formatTime(task.timeRemaining)
              : "Выполнить"}
          </button>

          {/* Плюс */}
          <button
            onClick={() => incrementRepeatableTask(task.id)}
            disabled={!canIncrement}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Увеличить прогресс"
          >
            +
          </button>

          {/* Очки */}
          <div className="flex flex-col items-start">
  <span className="px-3 py-1 rounded-full bg-indigo-200 text-indigo-800 font-bold">
    +{task.points * getMultiplier()}
  </span>
  {getMultiplierLabel() && (
    <span className="text-xs text-green-600 font-semibold mt-1">
      {getMultiplierLabel()}
    </span>
  )}
</div>

          {/* Удалить */}
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Удалить задание"
          >
            <Trash2 className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2"/>
            </Trash2>
          </button>
        </div>
      </div>
    );
  }

  // Если появятся другие типы — ничего не рендерим
  return null;
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

        {showSettings && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    {/* Центральное окно */}
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      {/* Заголовок */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Стандартные задания</h2>

      {/* Чекбокс “Все” */}
      {/* Чекбокс “Все” */}
<label className="flex items-center justify-between mb-4 px-3 py-2 rounded-lg border-2 border-indigo-400 bg-indigo-50">
  <span className="text-sm font-semibold text-indigo-700">Выбрать все задания</span>
  <input
    type="checkbox"
    checked={selectAllDefaults}
    onChange={(e) => toggleSelectAllDefaults(e.target.checked)}
    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
  />
</label>

      {/* Список заданий */}
      <div className="max-h-[60vh] overflow-y-auto space-y-3 mb-6 pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
        {defaultTasks.map(task => (
          <label key={task.id} className="flex items-center justify-between">
            <span className="text-gray-800 font-medium">{task.title}</span>
            <input
              type="checkbox"
              checked={task.enabled}
              onChange={() =>
                setDefaultTasks(prev =>
                  prev.map(t =>
                    t.id === task.id ? { ...t, enabled: !t.enabled } : t
                  )
                )
              }
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </label>
        ))}
      </div>

      {/* Кнопки управления */}
      <div className="flex justify-between gap-2">
        <button
          onClick={() => setShowSettings(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Назад
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Отмена
          </button>
          <button
  onClick={() => {
    const selected = defaultTasks.filter(t => t.enabled);

    // пересобираем tasks только из выбранных стандартных
    const mapped: Task[] = selected.map(t => {
  if (t.type === "simple") {
    return {
      id: Date.now() + Math.random(),
      title: t.title,
      points: t.points,
      type: "simple",
      completed: false,
    } as Task;
  } else {
    return {
      id: Date.now() + Math.random(),
      title: t.title,
      points: t.points,
      type: "repeatable",
      requiredCount: t.requiredCount,
      currentCount: 0,
      cooldown: t.cooldown,
      lastCompleted: null,
      timeRemaining: 0,
    } as Task;
  }
});

    setTasks(mapped); // заменяем список
    setShowSettings(false);
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
>
  Сохранить
</button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
      
    </div>
  );
}

export default App;