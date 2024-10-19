import { useState, useCallback } from 'react';
import { ItemNode } from '../interfaces'; // Ajuste o caminho conforme necessário

const useStockLocalExpansion = (nodes: ItemNode[]) => {
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});

    const expandNode = useCallback((node: ItemNode, _expandedKeys: { [key: string]: boolean }) => {
        if (node.children && node.children.length > 0 && node.key !== undefined && node.key !== null) {
            _expandedKeys[String(node.key)] = true; // Garantimos que `key` seja uma string
            for (let child of node.children) {
                expandNode(child, _expandedKeys);
            }
        }
    }, []);

    const expandAll = useCallback(() => {
        let _expandedKeys: { [key: string]: boolean } = {};
        for (let node of nodes) {
            expandNode(node, _expandedKeys);
        }
        setExpandedKeys(_expandedKeys);
    }, [nodes, expandNode]);

    const collapseAll = useCallback(() => {
        setExpandedKeys({});
    }, []);

    return { expandedKeys, setExpandedKeys, expandAll, collapseAll };
};

export default useStockLocalExpansion;
