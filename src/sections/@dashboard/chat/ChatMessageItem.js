import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox, partner }) {
  const { user } = useAuth();

  const sender = conversation.sender?.lname;
  const senderDetails = 'Me';
  
  const topDate = conversation && conversation.created_at;
  
  const isMe = conversation.sender_id === user.id;

  const isImage = 'image';
  // const isImage = message.contentType === 'image';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {conversation.sender_id !== user.id && (
          <Avatar alt={partner?.username} src={partner?.profile_photo_url == 'https://ui-avatars.com/api/?name=&color=7F9CF5&background=EBF4FF' ? '' : partner?.profile_photo_url} sx={{ width: 32, height: 32 }} />
        )}



        <Box sx={{ ml: 2 }}>
            <InfoStyle noWrap variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
              {!isMe && `${partner?.fname},`}&nbsp;
              {(conversation && conversation.created_at != undefined) &&  formatDistanceToNowStrict(new Date(topDate), {
                addSuffix: true,
              })}
            </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: 'grey.800',
                bgcolor: 'primary.lighter',
              }),
            }}
          >
            
              <Typography variant="body2">{conversation.message}</Typography>
            
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
