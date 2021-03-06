import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';

import useAuth from '../../../../hooks/useAuth';


// ----------------------------------------------------------------------

ProfileFollowInfo.propTypes = {
  profile: PropTypes.shape({
    follower: PropTypes.number,
    following: PropTypes.number,
  }),
};

export default function ProfileFollowInfo({ user }) {

  const { ref } = useAuth();

  const { balance, referrer_name, level } = user;

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">${fNumber(balance)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Balance
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{ ref =='You Do Not Have Any Referrals' ? '0' : ref.length  }</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Referrals
          </Typography>
        </Stack>
        
      </Stack>
    </Card>
  );
}
