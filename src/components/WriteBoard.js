import React, { useState } from 'react';


const express = require('express');
const cors = require('cors');
const app = express();

// 모든 출처에서의 요청을 허용합니다.
app.use(cors());

// 다른 미들웨어와 라우트를 추가합니다.
// ...

app.listen(8080, () => {
  console.log('서버가 포트 8080에서 실행 중입니다.');
});


const WriteBoard = () => {
    const [boardContent, setBoardContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const boardData = { content: boardContent };

        // 서버로 POST 요청을 보냅니다.
        fetch('http://localhost:8080', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boardData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('게시물 저장에 실패했습니다.');
                }
                console.log('게시물이 성공적으로 저장되었습니다.');
                // 저장이 성공하면 내용을 초기화합니다.
                setBoardContent('');
            })
            .catch(error => {
                console.error('게시물 저장에 실패했습니다:', error);
            });
    };  


    return (
        <>
            <div>
                <h2>새 게시물 작성</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={boardContent}
                        onChange={(e) => setBoardContent(e.target.value)}
                        placeholder="게시물 내용을 입력하세요"
                        rows={4}
                        cols={50}
                    />
                    <br />
                    <button type="submit">게시</button>
                </form>
            </div>
        </>
    );
};

export default WriteBoard;