import { Fragment, Suspense, useEffect, useState, use } from 'react';
import ReactDOM from 'react-dom/client';

// 简单例子 + 没有Suspense catch的情况
function App() {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Cpn id={0} timeout={1000} />
		</Suspense>
	);
}

const delay = (t) =>
	new Promise((r) => {
		setTimeout(r, t);
	});

const cachePool: any[] = [];

function fetchData(id, timeout) {
	const cache = cachePool[id];
	if (cache) {
		return cache;
	}
	return (cachePool[id] = delay(timeout).then(() => {
		return { data: Math.random().toFixed(2) * 100 };
	}));
}

function Cpn({ id, timeout }) {
	const [num, updateNum] = useState(0);
	const { data } = use(fetchData(id, timeout));

	if (num !== 0 && num % 5 === 0) {
		cachePool[id] = null;
	}

	useEffect(() => {
		console.log('effect create');
		return () => console.log('effect destroy');
	}, []);

	return (
		<ul onClick={() => updateNum(num + 1)}>
			<li>ID: {id}</li>
			<li>随机数: {data}</li>
			<li>状态: {num}</li>
		</ul>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
