import { createGlobalStyle } from "styled-components";
import NanumSquareB from "@fonts/NanumSquareB.ttf";
import NanumSquareEB from "@fonts/NanumSquareEB.ttf";
import NanumSquareL from "@fonts/NanumSquareL.ttf";
import NanumSquareR from "@fonts/NanumSquareR.ttf";
import NanumSquareRoundB from "@fonts/NanumSquareRoundB.ttf";
import NanumSquareRoundEB from "@fonts/NanumSquareRoundEB.ttf";
import NanumSquareRoundL from "@fonts/NanumSquareRoundL.ttf";
import NanumSquareRoundR from "@fonts/NanumSquareRoundR.ttf";

export const GlobalStyle = createGlobalStyle`
    @font-face{
        font-family: 'NanumSquareB';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareB}) format('truetype');
    }

    @font-face{
        font-family: 'NanumSquareEB';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareEB}) format('truetype');
    }

    @font-face{
        font-family: 'NanumSquareL';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareL}) format('truetype');
    }
        
    @font-face{
        font-family: 'NanumSquareR';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareR}) format('truetype');
    }

    @font-face{
        font-family: 'NanumSquareRoundB';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareRoundB}) format('truetype');
    }
        
    @font-face{
        font-family: 'NanumSquareRoundEB';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareRoundEB}) format('truetype');
    }
    
    @font-face{
        font-family: 'NanumSquareRoundL';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareRoundL}) format('truetype');
    }
    
    @font-face{
        font-family: 'NanumSquareRoundR';
        font-weight: normal;
        font-style: normal;
        src: url(${NanumSquareRoundR}) format('truetype');
    }
`;
