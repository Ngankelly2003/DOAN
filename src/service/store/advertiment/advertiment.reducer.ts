import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createAdvertiment,
  deleteAdvertiment,
  getAdvertiment,
  getAdvertiments,
  getAdvertimentByUser,
  updateAdvertiment,
  approvalAdvertiment,
  revenueAdvertiment,
  exportFileAdvertiment,
  getAdvertimentHome,
  requestApprovalAdvertiment,
} from "./advertiment.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IAdvertisement } from "@/model/advertisement.model";

interface IInitialAdvertisementState {
  loading: boolean;
  advertisement: IAdvertisement | null;
  advertisementHome: IAdvertisement[];
  updateStatusUser: boolean;
  deleteStatusUser: boolean;
  approvalStatus: boolean;
  errorMessage: string | null;
  revenue: null;
  isRequestApproval: boolean;
}

const initialState: IInitialAdvertisementState = {
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  advertisement: null,
  deleteStatusUser: false,
  approvalStatus: false,
  isRequestApproval: false,
  revenue: null,
  advertisementHome: [],
};

const advertisementAdapter = createEntityAdapter({
  selectId: (advertisement: IAdvertisement) =>
    advertisement.advertisementId ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "advertisementSlice",
  initialState: advertisementAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.approvalStatus = false;
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.isRequestApproval = false;
      state.initialState.advertisement = null;
      state.initialState.advertisementHome = [];
      state.initialState.errorMessage = null;
    },
    resetEntity(state) {
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.isRequestApproval = false;
      state.initialState.approvalStatus = false;
      state.initialState.loading = false;
      state.initialState.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAdvertiments.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        console.log("Got advertisements data:", payload.data);
        
        // Xử lý dữ liệu trước khi lưu vào store
        const processedData = payload.data.map(ad => {
          // Tạo bản sao của quảng cáo
          const processedAd = { ...ad };
          
          // Đảm bảo startTime và endTime luôn có giá trị
          processedAd.startTime = ad.startTime || ad.startDate || "";
          processedAd.endTime = ad.endTime || ad.endDate || "";
          
          // Xử lý trường advertisingFields
          if (!processedAd.advertisingFields || !Array.isArray(processedAd.advertisingFields)) {
            processedAd.advertisingFields = [];
          }
          
          // Đảm bảo advertisingFieldIds luôn là mảng
          if (!processedAd.advertisingFieldIds || !Array.isArray(processedAd.advertisingFieldIds)) {
            // Nếu không có advertisingFieldIds nhưng có advertisingFields
            if (Array.isArray(processedAd.advertisingFields) && processedAd.advertisingFields.length > 0) {
              // Tạo advertisingFieldIds từ advertisingFields
              processedAd.advertisingFieldIds = processedAd.advertisingFields
                .filter(field => field && field.advertisingFieldId)
                .map(field => field.advertisingFieldId);
            } else {
              processedAd.advertisingFieldIds = [];
            }
          }
          
          // Đảm bảo advertisingFields phản ánh đúng tất cả advertisingFieldIds
          if (processedAd.advertisingFieldIds && processedAd.advertisingFieldIds.length > 0) {
            // Tạo một Set các ID hiện có trong advertisingFields
            const existingFieldIds = new Set(
              processedAd.advertisingFields
                .filter(field => field && field.advertisingFieldId)
                .map(field => field.advertisingFieldId)
            );
            
            // Thêm các field còn thiếu vào advertisingFields
            processedAd.advertisingFieldIds.forEach(id => {
              if (!existingFieldIds.has(id)) {
                processedAd.advertisingFields.push({
                  advertisingFieldId: id,
                  advertisingFieldName: "" // Tên sẽ được cập nhật sau
                });
              }
            });
          }
          
          return processedAd;
        });
        
        console.log("Processed advertisements data:", processedData);
        advertisementAdapter.setAll(state as any, processedData);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertiments.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertimentByUser.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        console.log("Got user advertisements data:", payload.data);
        
        // Xử lý dữ liệu trước khi lưu vào store
        const processedData = payload.data.map(ad => {
          // Tạo bản sao của quảng cáo
          const processedAd = { ...ad };
          
          // Đảm bảo startTime và endTime luôn có giá trị
          processedAd.startTime = ad.startTime || ad.startDate || "";
          processedAd.endTime = ad.endTime || ad.endDate || "";
          
          // Xử lý trường advertisingFields
          if (!processedAd.advertisingFields || !Array.isArray(processedAd.advertisingFields)) {
            processedAd.advertisingFields = [];
          }
          
          // Đảm bảo advertisingFieldIds luôn là mảng
          if (!processedAd.advertisingFieldIds || !Array.isArray(processedAd.advertisingFieldIds)) {
            // Nếu không có advertisingFieldIds nhưng có advertisingFields
            if (Array.isArray(processedAd.advertisingFields) && processedAd.advertisingFields.length > 0) {
              // Tạo advertisingFieldIds từ advertisingFields
              processedAd.advertisingFieldIds = processedAd.advertisingFields
                .filter(field => field && field.advertisingFieldId)
                .map(field => field.advertisingFieldId);
            } else {
              processedAd.advertisingFieldIds = [];
            }
          }
          
          // Đảm bảo advertisingFields phản ánh đúng tất cả advertisingFieldIds
          if (processedAd.advertisingFieldIds && processedAd.advertisingFieldIds.length > 0) {
            // Tạo một Set các ID hiện có trong advertisingFields
            const existingFieldIds = new Set(
              processedAd.advertisingFields
                .filter(field => field && field.advertisingFieldId)
                .map(field => field.advertisingFieldId)
            );
            
            // Thêm các field còn thiếu vào advertisingFields
            processedAd.advertisingFieldIds.forEach(id => {
              if (!existingFieldIds.has(id)) {
                processedAd.advertisingFields.push({
                  advertisingFieldId: id,
                  advertisingFieldName: "" // Tên sẽ được cập nhật sau
                });
              }
            });
          }
          
          return processedAd;
        });
        
        console.log("Processed user advertisements data:", processedData);
        advertisementAdapter.setAll(state as any, processedData);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertimentByUser.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IAdvertisement>) => {
        state.initialState.advertisement = payload;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertimentHome.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        state.initialState.advertisementHome = payload.data;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertimentHome.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      createAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
        
        if (payload.data) {
          console.log("Processing advertisement data:", payload.data);
          
          // Nhân bản dữ liệu quảng cáo đã tạo
          const newAd = { ...payload.data };
          
          // Thiết lập các trường thời gian
          newAd.startTime = newAd.startTime || newAd.startDate || "";
          newAd.endTime = newAd.endTime || newAd.endDate || "";
          
          // Xử lý trường advertisingFields
          if (!newAd.advertisingFields || !Array.isArray(newAd.advertisingFields) || newAd.advertisingFields.length === 0) {
            // Nếu không có advertisingFields nhưng có advertisingFieldIds
            if (newAd.advertisingFieldIds && Array.isArray(newAd.advertisingFieldIds)) {
              console.log("Creating advertisingFields from advertisingFieldIds:", newAd.advertisingFieldIds);
              
              // Tìm thông tin đầy đủ của các fields từ API response nếu có
              const fieldsFromResponse = Array.isArray(payload.data.advertisingFields) ? payload.data.advertisingFields : [];
              
              // Tạo mảng advertisingFields từ advertisingFieldIds với thông tin đầy đủ nếu có
              newAd.advertisingFields = newAd.advertisingFieldIds.map((id: number) => {
                // Tìm field trong response nếu có
                const fieldFromResponse = fieldsFromResponse.find((f: any) => f.advertisingFieldId === id);
                if (fieldFromResponse) {
                  return fieldFromResponse;
                }
                // Nếu không tìm thấy, tạo một object cơ bản
                return {
                  advertisingFieldId: id,
                  advertisingFieldName: "" // Tên sẽ được cập nhật sau khi lấy dữ liệu
                };
              });
              
              console.log("Created advertisingFields:", newAd.advertisingFields);
            } else {
              // Nếu không có cả hai, khởi tạo mảng rỗng
              newAd.advertisingFields = [];
            }
          }
          
          console.log("Processed advertisement data for Redux store:", newAd);
          
          // Thêm quảng cáo vào store
          advertisementAdapter.addOne(state as any, newAd);
        }
      }
    );
    builder.addCase(
      createAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      updateAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
        
        if (payload.data) {
          console.log("Processing updated advertisement data:", payload.data);
          
          // Nhân bản dữ liệu quảng cáo đã cập nhật
          const updatedAd = { ...payload.data };
          
          // Thiết lập các trường thời gian
          updatedAd.startTime = updatedAd.startTime || updatedAd.startDate || "";
          updatedAd.endTime = updatedAd.endTime || updatedAd.endDate || "";
          
          // Xử lý trường advertisingFields
          if (!updatedAd.advertisingFields || !Array.isArray(updatedAd.advertisingFields) || updatedAd.advertisingFields.length === 0) {
            // Nếu không có advertisingFields nhưng có advertisingFieldIds
            if (updatedAd.advertisingFieldIds && Array.isArray(updatedAd.advertisingFieldIds)) {
              console.log("Creating advertisingFields from advertisingFieldIds:", updatedAd.advertisingFieldIds);
              
              // Tìm thông tin đầy đủ của các fields từ API response nếu có
              const fieldsFromResponse = Array.isArray(payload.data.advertisingFields) ? payload.data.advertisingFields : [];
              
              // Tạo mảng advertisingFields từ advertisingFieldIds với thông tin đầy đủ nếu có
              updatedAd.advertisingFields = updatedAd.advertisingFieldIds.map((id: number) => {
                // Tìm field trong response nếu có
                const fieldFromResponse = fieldsFromResponse.find((f: any) => f.advertisingFieldId === id);
                if (fieldFromResponse) {
                  return fieldFromResponse;
                }
                // Nếu không tìm thấy, tạo một object cơ bản
                return {
                  advertisingFieldId: id,
                  advertisingFieldName: "" // Tên sẽ được cập nhật sau khi lấy dữ liệu
                };
              });
              
              console.log("Created advertisingFields:", updatedAd.advertisingFields);
            } else {
              // Nếu không có cả hai, khởi tạo mảng rỗng
              updatedAd.advertisingFields = [];
            }
          }
          
          console.log("Processed updated data for Redux store:", updatedAd);
          
          // Cập nhật quảng cáo trong store
          advertisementAdapter.updateOne(state as any, {
            id: updatedAd.advertisementId,
            changes: updatedAd
          });
        }
      }
    );
    builder.addCase(
      updateAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );

    builder.addCase(
      approvalAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.approvalStatus = true;
      }
    );
    builder.addCase(
      approvalAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.approvalStatus = false;
      }
    );

    builder.addCase(
      requestApprovalAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.isRequestApproval = true;
        if (payload.data) {
          const updatedAd = payload.data;
          const entities = (state as any).entities;
          if (entities && entities[updatedAd.advertisement.advertisementId]) {
            const currentAd = entities[updatedAd.advertisement.advertisementId];
            entities[updatedAd.advertisement.advertisementId] = {
              ...currentAd,
              ...updatedAd.advertisement,
              startTime: updatedAd.advertisement.startTime || currentAd.startTime,
              endTime: updatedAd.advertisement.endTime || currentAd.endTime,
              advertisingFields: updatedAd.advertisement.advertisingFields || currentAd.advertisingFields
            };
          }
        }
      }
    );
    builder.addCase(
      requestApprovalAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.isRequestApproval = false;
      }
    );

    builder.addCase(
      revenueAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.revenue = payload.data;
        state.initialState.loading = false;
        if (payload.data && payload.data.advertisementId) {
          const entities = (state as any).entities;
          if (entities && entities[payload.data.advertisementId]) {
            entities[payload.data.advertisementId] = {
              ...entities[payload.data.advertisementId],
              isPaid: true
            };
          }
        }
      }
    );
    builder.addCase(
      revenueAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      exportFileAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        try {
          console.log(payload);

          const url = window.URL.createObjectURL(new Blob([payload.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Advertisement.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {}
      }
    );
    builder.addCase(
      exportFileAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      deleteAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.deleteStatusUser = true;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
        state.initialState.deleteStatusUser = false;
      }
    );
  },
});
export const { fetching, resetAll, resetEntity } = actions;
export const advertisementSelectors =
  advertisementAdapter.getSelectors<RootState>((state) => state.advertiment);
export default reducer;
