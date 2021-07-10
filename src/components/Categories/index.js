import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import http from 'src/utils/http-common';

const useStyles = makeStyles({
  root: {
    height: 'auto',
    flexGrow: 1,
    maxWidth: 400,
    // overflow: 'auto'
  },
});

export default function CategoriesComponent(props) {
  const classes = useStyles();
  const [dataCategories, setDataCategories] = React.useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await http.get("/categories?level=0");
      const data = response.data;
      setDataCategories(data);
    }

    loadCategories();
  }, [])

  const renderTree = (nodes) => (
    nodes.length > 0 ?
      nodes.map(node => {
        return (
          <TreeItem
            TreeItem key={node.id} nodeId={node.id.toString()}
            label={
              <div>
                <img style={{ width: '0.875rem', height: 'auto', marginRight: 5 }} src={node.icon} />
                <label>{node.name}</label>
              </div>
            }
          >
            {renderTree(node.categories)}
          </TreeItem>
        );
      })
      : null
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={props.expanded}
      selected={props.selected}
      onNodeToggle={props.onNodeToggle}
      onNodeSelect={props.onNodeSelect}
    >
      {renderTree(dataCategories)}
    </TreeView>
  );
}
