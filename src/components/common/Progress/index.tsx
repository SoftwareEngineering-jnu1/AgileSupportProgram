import React from 'react';
import styled from 'styled-components';

interface ProgressProps {
    total: number;
    completed: number;
    height?: string;
    borderRadius?: string;
}

const Progress : React.FC<ProgressProps> = ({total, completed, height, borderRadius}) => {
    const progress = total === 0? 0 : (completed / total) * 100;

    return (
        <ProgressTotal style={{height, borderRadius}}>
            <ProgressCompleted style={{ width: `${progress}%`}}/>
        </ProgressTotal>
        
    )
};

export default Progress;

const ProgressTotal = styled.div`
    border: 1px solid #969696;
    height: 10px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
`

const ProgressCompleted = styled.div`
    height: 100%;
    background-color: #4caf50;
    
`