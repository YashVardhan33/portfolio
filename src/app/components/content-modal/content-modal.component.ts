import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Injector, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
@Component({
  selector: 'app-content-modal',
  standalone: true, // Assuming AppComponent is standalone
  imports: [CommonModule,FormsModule,MonacoEditorModule],
  templateUrl: './content-modal.component.html',
  styleUrl: './content-modal.component.scss',
  animations: [
    trigger('modalAnimation',[
      transition(':enter',[
        style({transform: 'scale(0.8)',opacity: 0}),
        animate('200ms ease-out',style({transform: 'scale(1)',opacity:1})),

      ]),
      transition(':leave',[
        animate('150ms ease-in',style({transform: 'scale(0.8)',opacity: 0}))
      ]),
    ]),

    trigger('minimizeAnimation', [
      state('open', style({ transform: 'scale(1)', opacity: 1 })),
      state('minimized', style({ transform: 'scale(0.3)', opacity: 0.5 })),
      transition('open <=> minimized', animate('200ms ease-in-out')),
    ]),

    trigger('maximizeAnimation', [
      state('normal', style({ transform: 'scale(1)' })),
      state('maximized', style({ transform: 'scale(1)' })), // Optionally add transform
      transition('normal <=> maximized', animate('250ms ease-in-out')),
    ])

  ]
})
export class ContentModalComponent implements AfterViewInit {
    @Input() title = 'Untitled';
    @Input() content = '';
    @Input() zIndex = 100; // This will be applied via [style.zIndex] in the template
    @Input() id!: number;
    @Output() close = new EventEmitter<number>();
    @Output() focus = new EventEmitter<number>();
    @Output() minimize = new EventEmitter<number>();

    @ViewChild('modal') modalRef!: ElementRef<HTMLElement>; // Type the ElementRef
    isDragging = false;
    dragOffset = { x: 0, y: 0 };

    // Initial position - you can make these inputs too if you want more control from the service
    initialTop: string = '50px';
    initialLeft: string = '50px';
    width = 600;
    height =400;
    isResizing =false;
    resizeStart = {x:0,y:0,width:0,height: 0 };
    isMinimized = false;
    isMaximized = false;

    private lastPosition ={ left:'', top:'',width:'',height: ''};
    onMinimize(event: MouseEvent){
      event.stopPropagation();
      this.isMinimized = true;
      this.minimize.emit(this.id);
    }
    onMaximize(event: MouseEvent){
      event.stopPropagation();
      const modal = this.modalRef.nativeElement;
      this.lastPosition = {
        left: modal.style.left,
        top : modal.style.top,
        width: modal.style.width,
        height: modal.style.height,

      };
      modal.style.left = '0px';
      modal.style.top = '0px';
      modal.style.width = '100vw';
      modal.style.height = '100vh';

      this.width = window.innerWidth;
        this.height = window.innerHeight;

      this.isMaximized = true;
      setTimeout(()=>this.editorInstance?.layout(),0);
    }

    onRestore(event: MouseEvent){
      event.stopPropagation();
      const modal = this.modalRef.nativeElement;

      modal.style.left = this.lastPosition.left;
      modal.style.top = this.lastPosition.top;
      modal.style.width = this.lastPosition.width;
      modal.style.height = this.lastPosition.height;

      this.width = window.innerWidth;
        this.height = window.innerHeight;
      this.isMaximized = false;
      setTimeout(()=>
        this.editorInstance?.layout(),0);
    }



    ngAfterViewInit(): void {
      const modal = this.modalRef.nativeElement;
      // Apply initial cascading position based on ID
      modal.style.left = `${50 + (this.id -1) * 25}px`; // Stagger left
      modal.style.top = `${50 + (this.id -1) * 25}px`;  // Stagger top
    }

    @HostListener('mousedown') // This captures mousedown on the whole modal
    onModalMouseDown() {
      this.focus.emit(this.id);
    }

    onCloseClick(event: MouseEvent) {
      event.stopPropagation(); // Prevent mousedown on modal from firing if close is clicked
      this.close.emit(this.id);
    }

    startDrag(event: MouseEvent) {
      // Only start drag if mousedown is on the header
      this.isDragging = true;
      const modalEl = this.modalRef.nativeElement;
      const rect = modalEl.getBoundingClientRect();
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.focus.emit(this.id); // Also focus when starting drag from header
      event.preventDefault(); // Prevent text selection etc.
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
      if (this.isDragging) {
        const modalEl = this.modalRef.nativeElement;
        modalEl.style.left = `${event.clientX - this.dragOffset.x}px`;
        modalEl.style.top = `${event.clientY - this.dragOffset.y}px`; // Corrected to top
      }
      else if(this.isResizing){
        this.width = this.resizeStart.width+(event.clientX - this.resizeStart.x);
        this.height = this.resizeStart.height+(event.clientY - this.resizeStart.y);
      }

      if (this.editorInstance) {
         this.editorInstance.layout()
      }
    }

    @HostListener('document:mouseup')
    stopDrag() {
      this.isDragging = false;
      this.isResizing = false;
    }



    @Input() inputs: Record<string, any> = {};
    createInjector(): Injector{
      return Injector.create({
        providers: Object.entries(this.inputs).map(([key , value])=>({provide: key,
          useValue: value
        })),
        parent: inject(Injector)
      });
    }


    startResize(event: MouseEvent){
      const rect = this.modalRef.nativeElement.getBoundingClientRect();
      this.resizeStart = {
        x: event.clientX,
        y : event.clientY,
        width : rect.width,
        height : rect.height,
      };
      this.isResizing = true;
      event.stopPropagation();
      event.preventDefault();
    }

    @HostListener('window:resize')
    onWindowResize(){
      if (this.isMaximized) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.editorInstance?.layout();
      }
    }





    private editorInstance: monaco.editor.IStandaloneCodeEditor|undefined;

    onEditorInit(editor: monaco.editor.IStandaloneCodeEditor){
      this.editorInstance = editor;
    }

    editorOptions = {theme: 'vs-dark', language: 'markdown'};
}
