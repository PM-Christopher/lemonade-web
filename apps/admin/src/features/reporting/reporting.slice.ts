import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {reportingApi} from "@/features/reporting/api";


interface reportState {
    loading: boolean;
    error: boolean;
    reportData: {} | null
    report: {} | null
}

const initialState: reportState = {
    loading: false,
    error: false,
    reportData: null,
    report: null
};

const getReportData = createAsyncThunk("report/getReportData", async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
        let response = await reportingApi.getReportData(token);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});

const getReportDetail = createAsyncThunk("report/getReportDetail", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        let response = await reportingApi.getReportDetail(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});


const resolveReport = createAsyncThunk("report/markReport", async ({ token, id }: { token: string, id: number }, { rejectWithValue }) => {
    try {
        let response = await reportingApi.resolveReport(token, id);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});



const deleteReport = createAsyncThunk("report/getReportDetail", async ({ token, id, data }: { token: string, id: number, data: any }, { rejectWithValue }) => {
    try {
        let response = await reportingApi.deleteReportContent(token, id, data);
        return response.data;
    } catch (err: any) {
        if (!err.response) {
            throw err;
        }
        return rejectWithValue(err.response.data);
    }
});



const eventSlice = createSlice({
    name: "report",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getReportData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getReportData.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.reportData  = payload?.data
        });
        builder.addCase(getReportData.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(getReportDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getReportDetail.fulfilled, (state, { payload }) => {
            state.loading = false;
            // store data
            state.report  = payload?.data?.report
        });
        builder.addCase(getReportDetail.rejected, (state) => {
            state.loading = false;
        });

    }
});

export { getReportData, getReportDetail, resolveReport, deleteReport}
export default eventSlice.reducer;