import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { Photo } from '../photo.model';
import { PhotoService } from '../photos.service';

const PHOTO_STATE_KEY = 'photo_search';

export interface PhotoState {
  photos: Photo[];
  search: string;
  page: number;
  pages: number;
  loading: boolean;
  error: unknown;
}

const initialState: PhotoState = {
  photos: [],
  search: '',
  page: 1,
  pages: 1,
  loading: false,
  error: '',
};

export const PhotoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ page, pages }) => ({
    endOfPage: computed(() => page() === pages()),
  })),
  withComputed(
    ({ photos, search, page, pages, endOfPage, error, loading }) => ({
      vm: computed(() => ({
        photos: photos(),
        search: search(),
        page: page(),
        pages: pages(),
        endOfPage: endOfPage,
        error: error(),
        loading: loading(),
      })),
    }),
  ),
  withMethods((state, photoService = inject(PhotoService)) => ({
    load() {
      const savedJSONState = localStorage.getItem(PHOTO_STATE_KEY);
      if (savedJSONState) {
        const savedState = JSON.parse(savedJSONState);
        patchState(state, {
          search: savedState.search,
          page: savedState.page,
        });
      }
    },
    searchPhotos: rxMethod<void>(
      pipe(
        filter(() => state.search()?.length >= 3),
        tap(() => patchState(state, { loading: true, error: '' })),
        mergeMap(() => {
          const search = state.search();
          const page = state.page();
          return photoService.searchPublicPhotos(search, page).pipe(
            tapResponse({
              next: ({ photos: { photo, pages } }) => {
                patchState(state, {
                  loading: false,
                  photos: photo,
                  pages,
                });
                localStorage.setItem(
                  PHOTO_STATE_KEY,
                  JSON.stringify({ search, page }),
                );
              },
              error: (error: unknown) =>
                patchState(state, { error, loading: false }),
            }),
          );
        }),
      ),
    ),
  })),
  withMethods((store) => ({
    updateNextPage() {
      patchState(store, { page: store.page() + 1 });
      store.searchPhotos();
    },
    updatePreviousPage() {
      patchState(store, { page: store.page() - 1 });
      store.searchPhotos();
    },
    updateSearch(search: string) {
      patchState(store, { search: search, page: 1 });
      store.searchPhotos();
    },
  })),
  withHooks({
    onInit({ load }) {
      load();
    },
  }),
);
