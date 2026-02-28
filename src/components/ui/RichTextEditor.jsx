import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Link } from '@tiptap/extension-link';

import {
    ToggleButton, ToggleButtonGroup, Box, Divider,
    IconButton, Tooltip, Popover, TextField, Button
} from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, FormatStrikethrough,
    FormatListBulleted, FormatListNumbered,
    FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify,
    FormatColorText, Highlight as HighlightIcon,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    FormatQuote, Link as LinkIcon, LinkOff as LinkOffIcon,
    Undo as UndoIcon, Redo as RedoIcon, Remove as HrIcon
} from '@mui/icons-material';

// Helper component for Color Picker
const ColorPicker = ({ editor, icon: Icon, tooltip, isHighlight = false }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [colorValue, setColorValue] = React.useState('#000000');

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const applyColor = () => {
        if (isHighlight) {
            editor.chain().focus().setHighlight({ color: colorValue }).run();
        } else {
            editor.chain().focus().setColor(colorValue).run();
        }
        handleClose();
    };

    return (
        <>
            <Tooltip title={tooltip}>
                <ToggleButton value="color" onClick={handleClick} size="small" sx={{ border: 'none' }}>
                    <Icon fontSize="small" sx={{ color: isHighlight ? colorValue : (editor.getAttributes('textStyle').color || 'inherit') }} />
                </ToggleButton>
            </Tooltip>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <input
                        type="color"
                        value={colorValue}
                        onChange={(e) => setColorValue(e.target.value)}
                        style={{ width: '100%', height: '30px', cursor: 'pointer' }}
                    />
                    <Button size="small" variant="contained" onClick={applyColor}>Apply</Button>
                    <Button size="small" variant="outlined" onClick={() => {
                        if (isHighlight) editor.chain().focus().unsetHighlight().run();
                        else editor.chain().focus().unsetColor().run();
                        handleClose();
                    }}>Clear</Button>
                </Box>
            </Popover>
        </>
    );
};

// Helper component for Link insertion
const LinkDialog = ({ editor }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [url, setUrl] = React.useState('');

    const handleClick = (event) => {
        const previousUrl = editor.getAttributes('link').href;
        setUrl(previousUrl || '');
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);

    const setLink = () => {
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        handleClose();
    };

    return (
        <>
            <Tooltip title="Insert Link">
                <ToggleButton
                    value="link"
                    selected={editor.isActive('link')}
                    onClick={handleClick}
                    size="small"
                >
                    <LinkIcon fontSize="small" />
                </ToggleButton>
            </Tooltip>
            <Tooltip title="Remove Link">
                <ToggleButton
                    value="unlink"
                    disabled={!editor.isActive('link')}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    size="small"
                >
                    <LinkOffIcon fontSize="small" />
                </ToggleButton>
            </Tooltip>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        autoFocus
                    />
                    <Button variant="contained" onClick={setLink}>Set</Button>
                </Box>
            </Popover>
        </>
    );
};

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <Box sx={{ p: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider', bgcolor: '#f1f5f9', alignItems: 'center' }}>
            {/* History */}
            <ToggleButtonGroup size="small">
                <Tooltip title="Undo"><IconButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} size="small"><UndoIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Redo"><IconButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} size="small"><RedoIcon fontSize="small" /></IconButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Formatting */}
            <ToggleButtonGroup size="small" aria-label="text formatting">
                <Tooltip title="Bold"><ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Italic"><ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Underline"><ToggleButton value="underline" selected={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Strikethrough"><ToggleButton value="strike" selected={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><FormatStrikethrough fontSize="small" /></ToggleButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Scripts */}
            <ToggleButtonGroup size="small">
                <Tooltip title="Subscript"><ToggleButton value="subscript" selected={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}><SubscriptIcon fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Superscript"><ToggleButton value="superscript" selected={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}><SuperscriptIcon fontSize="small" /></ToggleButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Colors */}
            <Box sx={{ display: 'flex', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                <ColorPicker editor={editor} icon={FormatColorText} tooltip="Text Color" />
                <ColorPicker editor={editor} icon={HighlightIcon} tooltip="Highlight Color" isHighlight />
            </Box>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Headings */}
            <ToggleButtonGroup size="small" aria-label="headings">
                <Tooltip title="Heading 1"><ToggleButton value="h1" selected={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} sx={{ fontWeight: 'bold' }}>H1</ToggleButton></Tooltip>
                <Tooltip title="Heading 2"><ToggleButton value="h2" selected={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} sx={{ fontWeight: 'bold' }}>H2</ToggleButton></Tooltip>
                <Tooltip title="Heading 3"><ToggleButton value="h3" selected={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} sx={{ fontWeight: 'bold' }}>H3</ToggleButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Alignment */}
            <ToggleButtonGroup size="small" aria-label="alignment" exclusive>
                <Tooltip title="Align Left"><ToggleButton value="left" selected={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Align Center"><ToggleButton value="center" selected={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Align Right"><ToggleButton value="right" selected={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Justify"><ToggleButton value="justify" selected={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><FormatAlignJustify fontSize="small" /></ToggleButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Lists & Blocks */}
            <ToggleButtonGroup size="small">
                <Tooltip title="Bullet List"><ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Ordered List"><ToggleButton value="orderedList" selected={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered fontSize="small" /></ToggleButton></Tooltip>
                <Tooltip title="Blockquote"><ToggleButton value="blockquote" selected={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote fontSize="small" /></ToggleButton></Tooltip>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

            {/* Inserts */}
            <ToggleButtonGroup size="small">
                <LinkDialog editor={editor} />
                <Tooltip title="Horizontal Rule"><IconButton size="small" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HrIcon fontSize="small" /></IconButton></Tooltip>
            </ToggleButtonGroup>
        </Box>
    );
};

const RichTextEditor = ({ value, onChange, placeholder = '' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            Link.configure({ openOnClick: false, autolink: true })
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[250px] p-4 text-gray-800',
            },
        },
    });

    // Handle value prop changes from outside (e.g. initial load or reset)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Small check to not overwrite if just typing
            const currentContent = editor.getHTML();
            if (value !== undefined && currentContent !== value) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <Box sx={{ border: 1, borderColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden', bgcolor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <MenuBar editor={editor} />
            <Box sx={{
                cursor: 'text',
                '& .ProseMirror': {
                    minHeight: '250px',
                    outline: 'none',
                    p: 3,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    '& p.is-editor-empty:first-of-type::before': {
                        color: '#94a3b8',
                        content: `"${placeholder}"`,
                        float: 'left',
                        height: 0,
                        pointerEvents: 'none'
                    },
                    '& p': { m: 0, mb: 1.5, lineHeight: 1.6 },
                    '& ul': { pl: 5, m: 0, mb: 1.5, listStyleType: 'disc' },
                    '& ol': { pl: 5, m: 0, mb: 1.5, listStyleType: 'decimal' },
                    '& h1': { fontSize: '2em', fontWeight: 'bold', m: 0, mt: 2, mb: 1.5, lineHeight: 1.2 },
                    '& h2': { fontSize: '1.5em', fontWeight: 'bold', m: 0, mt: 2, mb: 1, lineHeight: 1.3 },
                    '& h3': { fontSize: '1.25em', fontWeight: 'bold', m: 0, mt: 1.5, mb: 1, lineHeight: 1.4 },
                    '& a': { color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' },
                    '& blockquote': { borderLeft: '4px solid #cbd5e1', pl: 2, color: '#475569', fontStyle: 'italic', my: 1.5 },
                    '& hr': { borderTop: '2px solid #e2e8f0', my: 3 },
                    '& mark': { borderRadius: '2px', padding: '0 2px' }
                }
            }}>
                <EditorContent editor={editor} />
            </Box>
        </Box>
    );
};

export default RichTextEditor;
