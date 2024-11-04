import React, { useRef, useState } from 'react';
import { simpleChatApiRef } from '../../api/types';
import { useApi } from '@backstage/core-plugin-api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

export const ChatMessageInput = () => {
  const simpleChatApi = useApi(simpleChatApiRef);
  const [proxy, setProxy] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>();
  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <FormGroup>
          <TextField
            inputRef={input}
            fullWidth
            variant="outlined"
            onKeyDown={async event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                await simpleChatApi.postMessage({
                  message: input.current!.value,
                  useProxy: proxy,
                });
                input.current!.value = '';
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={proxy}
                onChange={_ => setProxy(!proxy)}
              />
            }
            label="Use Proxy"
          />
        </FormGroup>
      </Box>
    </>
  );
};
