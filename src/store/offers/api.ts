import {createAsyncThunk} from '@reduxjs/toolkit';
import {Offer, OfferDetails} from '../../types/offer.ts';
import {ThunkExtraArguments} from '../index.ts';
import {commentsUrl, offersUrl} from '../../const/api.ts';
import {Feedback, FeedbackData} from '../../types/feedback.ts';

export type AppThunkConfig = {
    extra: ThunkExtraArguments;
    rejectValue: string;
};

export const loadOffers = createAsyncThunk<
  Offer[],
  void,
  AppThunkConfig
>(
  'offers/loadOffers',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Offer[]>(
        offersUrl.offers
      );

      return data;
    } catch {
      return rejectWithValue('Failed to load offers');
    }
  }
);

export const getOfferDetails = createAsyncThunk<
  OfferDetails,
  string,
  AppThunkConfig
>(
  'offers/getOfferDetails',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<OfferDetails>(offersUrl.offerDetails(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offer details');
    }
  }
);

export const getOffersNearby = createAsyncThunk<
  Offer[],
  string,
  AppThunkConfig
>(
  'offers/loadOffersNearby',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Offer[]>(offersUrl.offersNearby(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offers nearby');
    }
  }
);

export const getOfferComments = createAsyncThunk<
  Feedback[],
  string,
  AppThunkConfig
>(
  'offer/getComments',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Feedback[]>(commentsUrl.offerComments(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offer comments');
    }
  }
);

export const submitOfferComment = createAsyncThunk<
  Feedback,
  { offerId: string; feedbackData: FeedbackData },
  AppThunkConfig
>(
  'offer/submitComment',
  async ({offerId, feedbackData}, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.post<Feedback>(commentsUrl.offerComments(offerId), feedbackData);

      return data;
    } catch {
      return rejectWithValue('Failed submit offer comment');
    }
  }
);
