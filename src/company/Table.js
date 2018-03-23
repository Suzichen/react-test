import React from 'react';

import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};
const Mytable = ({ list, onDissmiss}) => {
  return (
    <Paper style={styles.root}>
      <Table style={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>文章标题</TableCell>
            <TableCell numeric>作者</TableCell>
            <TableCell numeric>评论数</TableCell>
            <TableCell numeric>点击量</TableCell>
            <TableCell style={{ textAlign: 'center' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map(item =>
            <TableRow key={item.objectID}>
              <TableCell style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
              </TableCell>
              <TableCell numeric>{item.author}</TableCell>
              <TableCell numeric>{item.num_comments}</TableCell>
              <TableCell numeric>{item.points}</TableCell>
              <TableCell >
                <Button 
                  color="secondary"
                  onClick={() => onDissmiss(item.objectID)} 
                  className="button-inline"
                >
                  删除
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Mytable;