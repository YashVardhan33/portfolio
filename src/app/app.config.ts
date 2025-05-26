import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxMonacoEditorConfig, provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { routes } from './app.routes';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets/monaco-editor/min/vs',
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideMonacoEditor(monacoConfig) ]
};
