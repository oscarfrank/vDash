import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import React from 'react';


// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';

// routes
import { PATH_ADMIN, PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import DataNotFound from '../../../components/DataNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { fDate,fDateTime } from '../../../utils/formatTime';

// sections
import { AlertListHead, AlertListToolbar, PagesMoreMenu } from '../../../sections/@dashboard/user/list';

// Axios
import axios from '../../../utils/axios';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'description', label: 'Message', alignRight: false },
  { id: 'created_at', label: 'Date', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

AlertList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AlertList() {

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const [allAlert, setAllAlert] = useState([]);
  const [alertList, setAlertList] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('all');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {

    setLoadingData(true);

    axios
    .get(`/api/alert?page=${page}`)
      .then(({ data }) => {
        console.log(data);

        // setTimeout( () => {
          setAllAlert(data);
          setAlertList(data.data);
          setRowsPerPage(data.per_page);
          //Remove Loading
          setLoadingData(false);
          console.log(data);


        // }, 5000)

      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, filterName]);


  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');



  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  // const isNotFound = !filteredUsers.length && Boolean(filterName);
  const isNotFound = true;


  return (
    <RoleBasedGuard accessibleRoles="ROLE_ADMIN">
        <Page title="Alert: List">
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Alert List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Admin', href: PATH_ADMIN.admin.dashboard },
                { name: 'Alert List' },
              ]}
              action={
                <NextLink href={PATH_ADMIN.admin.alertNew} passHref>
                  <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                    New Alert
                  </Button>
                  
                </NextLink>
              }
            />

            <Card>
              <AlertListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <AlertListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={allAlert.total}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                    />

                      {loadingData && (
                          <TableBody>
                            <TableRow>
                              <TableCell align="center" colSpan={6} sx={{ py: 3 }}>

                                <div className="dot-carousel" style={{ margin: "0 auto" }}></div>
                                <h3>Loading Data...</h3>
                                
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                    
                    <TableBody>

                      {alertList?.map((row) => {
                        
                        const { title, id, body, slug, created_at } = row;

                        return (
                          <TableRow
                            hover
                            key={id}
                          >
                            <TableCell align="left">{title}</TableCell>
                            <TableCell align="left">{body.slice(0,30)}...</TableCell>
                            <TableCell align="left">{fDate(created_at)}</TableCell>
                            <TableCell align="right">
                              <PagesMoreMenu onDelete={() => console.log('Delete')} id={id} pathurl={PATH_ADMIN.admin.alertEdit} />
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    </TableBody>
                    
                    {allAlert.total == 0 && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <DataNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                  
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={allAlert.total}
                rowsPerPage={rowsPerPage}
                page={page == 0 ? page : page-1}
                onPageChange={(e, page) => setPage(page+1)}
              />
            </Card>
          </Container>
        </Page>
    </RoleBasedGuard>
    
  );
}

// ----------------------------------------------------------------------


