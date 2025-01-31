// src/app/stats/page.js
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Chart } from "react-google-charts";
import { useRouter } from 'next/navigation';

const getPriorityColor = (priority) => {
    switch (priority) {
        case '高':
            return '#ff6b6b'; // 红色
        case '中':
            return '#ffa500'; // 橙色
        case '低':
            return '#61cf65'; // 绿色
        default:
            return 'transparent';
    }
};

// 新的标签颜色方案（第二版）
const getTagColor = (tag, index) => {
   const tagColors = [
        '#6eeeff', // 青色
        '#61cf65', // 绿色
        '#FF9800', // 橙色
        '#ff6b9c', // 粉色
        '#ec7fff', // 紫色
        '#4fc7ff'  // 蓝色
    ];
    return tagColors[index % tagColors.length] || '#e0e0e0'; // 默认灰色
};

export default function Stats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedTodos, setCompletedTodos] = useState([]); // 存储已完成事项
    const [modalOpen, setModalOpen] = useState(false); // 控制模态框的显示
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {

                const token = localStorage.getItem('token');
                 if(!token) {
                    router.push('/auth');
                     return;
                   }

                const headers = {
                   Authorization: `Bearer ${token}`,
                    };
                const response = await axios.get('/api/todos/stats', { headers: headers });
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('获取统计数据失败:', error);
                setError("加载统计数据失败。");
                setLoading(false);
            }
        };

        const fetchCompletedTodos = async () => {
               const token = localStorage.getItem('token');
                  if(!token) {
                     router.push('/auth');
                        return;
                  }

                const headers = {
                    Authorization: `Bearer ${token}`,
                    };
            try {
                const response = await axios.get('/api/todos/completed', { headers: headers}); // 假设有一个 API 获取已完成事项
                setCompletedTodos(response.data);
            } catch (error) {
                console.error('获取已完成事项失败:', error);
            }
        };

        fetchStats();
        fetchCompletedTodos(); // 预先加载已完成事项
    }, [router]);

    // 打开模态框
    const handleCompletedClick = () => {
        setModalOpen(true);
    };

    // 将 priorityCounts 转换为适合图表的数据格式，包含颜色
    const priorityChartData = stats?.priorityCounts ? [
        ["优先级", "数量", { role: "style" }],
        ...stats.priorityCounts.map(item => [
            item.priority,
            item.count,
            getPriorityColor(item.priority),
        ])
    ] : null;

    // 将 tagCounts 转换为适合条形图的数据格式
    const tagChartData = stats?.tagCounts ? [
        ["标签", "数量", { role: "style" }, { role: "annotation" }], // 添加注释角色
        ...stats.tagCounts.map((item, index) => [
            item.tag,
            item.count,
            getTagColor(item.tag, index), // 颜色
            item.tag + ": " + item.count // 注释内容
        ])
    ] : null;

    const chartOptions = {
        title: "类别数量",
        is3D: true,
        chartArea: { width: '90%', height: '80%' },
        colors: priorityChartData ? priorityChartData.slice(1).map(item => item[2]) : [], // 提取优先级颜色数据
    };

    const tagChartOptions = {
        title: "标签数量",
        chartArea: { width: '100%', height: '80%' },
        hAxis: {
            title: '数量',
            minValue: 0,
            gridlines: { count: 5 },
        },
        vAxis: {
            title: '标签',
        },
        legend: { position: 'none' }, // 隐藏图例
        colors: tagChartData ? tagChartData.slice(1).map(item => item[2]) : [], // 提取标签颜色数据
        bar: { groupWidth: "40%" }, // 设置条形宽度
        annotations: {
            alwaysOutside: false,
            textStyle: {
                fontSize: 12,
                color: '#000',
                auraColor: 'none',
            },
        },
    };

    return (
        <main className="font-sans bg-gray-100 min-h-screen sm:p-6 flex justify-center">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center w-full">
                    <Link href="/" className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-black rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 sm:h-5 sm:w-5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center flex-grow">待办事项统计</h1>
                </div>

                {loading && <div className="text-center text-gray-500">正在加载统计数据...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {stats && (
                    <div className="space-y-4 sm:space-y-6">

                        {/* Total, Completed, Pending */}
                        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 sm:gap-6">
                            <div className="p-4 sm:p-6 bg-white shadow rounded-lg">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">总任务数</h2>
                                <p className="text-xl sm:text-2xl font-bold text-red-500">{stats.total}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-white shadow rounded-lg cursor-pointer" onClick={handleCompletedClick}>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">已完成</h2>
                                <p className="text-xl sm:text-2xl font-bold text-green-500">{stats.completed}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-white shadow rounded-lg">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">待完成</h2>
                                <p className="text-xl sm:text-2xl font-bold text-orange-400">{stats.pending}</p>
                            </div>
                        </div>

                        {/* Priority Counts */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6 flex justify-center">
                            <div className="w-full md:w-3/4 lg:w-2/3">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">优先级统计</h2>
                                {priorityChartData && priorityChartData.length > 1 ? (
                                    <Chart
                                        chartType="PieChart"
                                        data={priorityChartData}
                                        options={chartOptions}
                                        width={"100%"}
                                        height={"300px"}
                                    />
                                ) : (
                                    <p className="text-gray-500">暂无优先级数据。</p>
                                )}
                            </div>
                        </div>

                        {/* Tag Counts (修改为条形图) */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6 flex justify-center">
                            <div className="w-full md:w-3/4 lg:w-2/3">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">标签统计</h2>
                                {tagChartData && tagChartData.length > 1 ? (
                                    <Chart
                                        chartType="BarChart"  // 修改为条形图
                                        data={tagChartData}
                                        options={tagChartOptions}
                                        width={"100%"}
                                        height={"300px"}
                                    />
                                ) : (
                                    <p className="text-gray-500">暂无标签数据。</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* 模态框 */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                onClick={() => setModalOpen(false)}
                                aria-label="关闭"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">已完成事项</h2>
                            <ul className="flex flex-wrap gap-4" style={{ lineHeight: '0.75' }}>
                                {completedTodos.map((todo) => (
                                    <li key={todo.id} className="font-bold" style={{ color: getPriorityColor(todo.priority) }}>
                                        {todo.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
